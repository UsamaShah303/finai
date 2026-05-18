"""
Modern Portfolio Theory (MPT) optimisation via PyPortfolioOpt.

Given a set of symbols and a risk level, compute optimal portfolio weights
using Efficient Frontier analysis on 1 year of historical price data.
"""

import logging
import time
import yfinance as yf
import pandas as pd
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.exceptions import OptimizationError

logger = logging.getLogger(__name__)

# Default symbol universes per market focus
DEFAULT_SYMBOLS = {
    "both": ["SPY", "VXUS", "BND", "GLD", "VWO", "VNQ"],
    "international": ["SPY", "VXUS", "BND", "GLD", "VWO", "VNQ"],
    "pakistan": ["OGDC.KA", "ENGRO.KA", "LUCK.KA", "HBL.KA", "MCB.KA"],
}


def _download_prices(symbols: list[str], max_retries: int = 3) -> pd.DataFrame:
    """
    Download price data from yFinance with retry + backoff.
    Tries 1y first, falls back to 6mo if rate-limited.
    """
    periods = ["1y", "6mo", "3mo"]
    for attempt in range(max_retries):
        period = periods[min(attempt, len(periods) - 1)]
        try:
            data = yf.download(symbols, period=period, progress=False)
            if data is not None and not data.empty:
                # Handle multi-level columns from yf.download
                if isinstance(data.columns, pd.MultiIndex):
                    data = data["Close"]
                elif "Close" in data.columns:
                    data = data[["Close"]]
                    data.columns = symbols
                # Drop columns with all NaN (invalid tickers)
                data = data.dropna(axis=1, how="all")
                # Forward-fill gaps, then drop remaining NaN rows
                data = data.ffill().dropna()
                if not data.empty and len(data.columns) >= 2:
                    return data
        except Exception as e:
            logger.warning(f"yf.download attempt {attempt+1} failed ({period}): {e}")

        if attempt < max_retries - 1:
            wait = 2 * (attempt + 1)  # 2s, 4s
            logger.info(f"Retrying in {wait}s...")
            time.sleep(wait)

    return pd.DataFrame()


def optimise(
    symbols: list[str],
    risk_level: str = "Moderate",
    total_amount: float = 100000.0,
) -> dict:
    """
    Run Efficient Frontier optimisation.

    Args:
        symbols: list of ticker symbols (Yahoo Finance format).
        risk_level: "Conservative", "Moderate", or "Aggressive".
        total_amount: total investment amount (for discrete allocation).

    Returns:
        dict with weights, expected_return, volatility, sharpe_ratio.
    """
    if not symbols or len(symbols) < 2:
        return {"error": "Need at least 2 symbols for optimisation"}

    try:
        data = _download_prices(symbols)

        if data.empty or len(data.columns) < 2:
            return {"error": "Not enough valid price data for optimisation. yFinance may be rate-limited — try again in a minute."}

        # Calculate expected returns and covariance
        mu = expected_returns.mean_historical_return(data)
        S = risk_models.sample_cov(data)

        ef = EfficientFrontier(mu, S)

        # Optimise based on risk level
        if risk_level == "Conservative":
            ef.min_volatility()
        elif risk_level == "Aggressive":
            try:
                ef.efficient_return(target_return=0.25)
            except OptimizationError:
                # If 25% return isn't achievable, maximise Sharpe instead
                ef = EfficientFrontier(mu, S)
                ef.max_sharpe()
        else:
            # Moderate → maximise Sharpe ratio
            ef.max_sharpe()

        weights = ef.clean_weights()
        performance = ef.portfolio_performance(verbose=False)

        return {
            "weights": {k: round(v, 4) for k, v in dict(weights).items()},
            "expected_return": round(performance[0], 4),
            "volatility": round(performance[1], 4),
            "sharpe_ratio": round(performance[2], 4),
            "risk_level": risk_level,
            "symbols_used": list(data.columns),
        }

    except Exception as e:
        logger.error(f"Portfolio optimisation failed: {e}")
        return {"error": str(e)}
