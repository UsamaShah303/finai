"""
Live market data via yFinance + Finnhub ESG scoring.
Replaces all hardcoded price stubs.

Includes PSX fallback: if yFinance fails for a PSX ticker,
falls back to the last cached price from Supabase.
"""

import yfinance as yf
import requests
import logging
import os

logger = logging.getLogger(__name__)

# PSX tickers use .KA suffix on Yahoo Finance
PSX_TICKERS = {
    "PSX-100", "OGDC", "PPL", "ENGRO", "FATIMA",
    "LUCK", "DGKC", "HBL", "MCB", "KSE-30",
}

# Some tickers need mapping to valid Yahoo symbols
TICKER_MAP = {
    "PSX-100": "^KSE100",
    "KSE-30":  "^KSE30",
    "BND/PIB": "BND",       # fallback to US bond ETF
    "VNQ/JSCL": "VNQ",      # fallback to US REIT
    "GOLD-PK": "GLD",       # fallback
    "CASH-PK": None,        # no ticker
    "CASH":    None,
}


def _resolve_ticker(symbol: str, market: str = "INTL") -> str | None:
    """Resolve a FinAI symbol to a valid Yahoo Finance ticker."""
    # Check explicit mapping first
    if symbol in TICKER_MAP:
        return TICKER_MAP[symbol]
    # PSX stocks use .KA suffix
    if market == "PSX" or symbol in PSX_TICKERS:
        return f"{symbol}.KA"
    return symbol


def _fallback_price_from_db(symbol: str) -> float | None:
    """
    Fallback: return last cached avg_buy_price from Supabase.
    This ensures PSX tickers always return *something* even when
    yFinance is down or returns no data.
    """
    try:
        from db import supabase
        result = supabase.table("virtual_holdings") \
            .select("avg_buy_price") \
            .eq("symbol", symbol) \
            .limit(1) \
            .execute()
        if result.data:
            price = result.data[0].get("avg_buy_price")
            if price and float(price) > 0:
                logger.info(f"Using cached fallback price for {symbol}: {price}")
                return round(float(price), 2)
    except Exception as e:
        logger.warning(f"Fallback DB price lookup failed for {symbol}: {e}")
    return None


def get_price(symbol: str, market: str = "INTL") -> float | None:
    """
    Fetch the latest price for a symbol.
    Falls back to cached DB price if yFinance fails (especially for PSX).
    Returns None only if all sources fail — frontend shows "price unavailable".
    """
    ticker_str = _resolve_ticker(symbol, market)
    if not ticker_str:
        return None

    # Attempt 1: yFinance fast_info
    try:
        ticker = yf.Ticker(ticker_str)
        info = ticker.fast_info
        price = info.get("lastPrice") or info.get("last_price")
        if price and float(price) > 0:
            return round(float(price), 2)
    except Exception as e:
        logger.warning(f"yFinance fast_info failed for {ticker_str}: {e}")

    # Attempt 2: yFinance recent history
    try:
        hist = yf.Ticker(ticker_str).history(period="5d")
        if not hist.empty:
            price = float(hist["Close"].iloc[-1])
            if price > 0:
                return round(price, 2)
    except Exception as e:
        logger.warning(f"yFinance history failed for {ticker_str}: {e}")

    # Attempt 3: Supabase cached price (PSX fallback)
    logger.info(f"All yFinance attempts failed for {symbol}, trying DB fallback")
    return _fallback_price_from_db(symbol)


def get_pkr_usd_rate() -> float | None:
    """Fetch current USD/PKR exchange rate."""
    try:
        ticker = yf.Ticker("USDPKR=X")
        info = ticker.fast_info
        rate = info.get("lastPrice") or info.get("last_price")
        if rate:
            return round(float(rate), 2)
        return None
    except Exception as e:
        logger.warning(f"Failed to fetch USD/PKR rate: {e}")
        return None


def get_historical(symbol: str, period: str = "1y", market: str = "INTL") -> list[float]:
    """
    Return historical closing prices as a list of floats.
    Period can be: 1mo, 3mo, 6mo, 1y, 2y, 5y, max
    """
    ticker_str = _resolve_ticker(symbol, market)
    if not ticker_str:
        return []
    try:
        ticker = yf.Ticker(ticker_str)
        df = ticker.history(period=period)
        if df.empty:
            return []
        return [round(float(p), 2) for p in df["Close"].tolist()]
    except Exception as e:
        logger.warning(f"Failed to fetch history for {ticker_str}: {e}")
        return []


def get_bulk_prices(symbols: list[str], market: str = "INTL") -> dict[str, float | None]:
    """Fetch prices for multiple symbols at once."""
    result = {}
    for sym in symbols:
        result[sym] = get_price(sym, market)
    return result


# ---------------------------------------------------------------------------
# Finnhub ESG Scoring
# ---------------------------------------------------------------------------

# Default ESG scores when API is unavailable or symbol not covered
_DEFAULT_ESG = {
    "total": 50,
    "environmental": 50,
    "social": 50,
    "governance": 50,
}


def get_esg_score(symbol: str) -> dict:
    """
    Fetch ESG scores from Finnhub.
    Free tier: 60 calls/minute.

    Returns dict with total, environmental, social, governance scores (0-100).
    Falls back to neutral defaults if API is unavailable.
    """
    finnhub_key = os.getenv("FINNHUB_KEY")
    if not finnhub_key:
        logger.warning("FINNHUB_KEY not set — returning default ESG scores")
        return {**_DEFAULT_ESG, "source": "default"}

    # PSX stocks don't have Finnhub ESG coverage — return defaults
    if symbol in PSX_TICKERS:
        return {**_DEFAULT_ESG, "source": "default_psx"}

    try:
        url = "https://finnhub.io/api/v1/stock/esg"
        params = {"symbol": symbol, "token": finnhub_key}
        r = requests.get(url, params=params, timeout=5)
        r.raise_for_status()
        data = r.json()

        if not data or "totalESGScore" not in data:
            return {**_DEFAULT_ESG, "source": "finnhub_empty"}

        return {
            "total": round(data.get("totalESGScore", 50), 1),
            "environmental": round(data.get("environmentScore", 50), 1),
            "social": round(data.get("socialScore", 50), 1),
            "governance": round(data.get("governanceScore", 50), 1),
            "source": "finnhub",
        }
    except requests.exceptions.Timeout:
        logger.warning(f"Finnhub ESG timeout for {symbol}")
        return {**_DEFAULT_ESG, "source": "timeout"}
    except Exception as e:
        logger.warning(f"Finnhub ESG failed for {symbol}: {e}")
        return {**_DEFAULT_ESG, "source": "error"}


def get_bulk_esg(symbols: list[str]) -> dict[str, dict]:
    """Fetch ESG scores for multiple symbols."""
    result = {}
    for sym in symbols:
        result[sym] = get_esg_score(sym)
    return result
