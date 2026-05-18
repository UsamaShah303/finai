# services/portfolio.py
# FinAI Nexus — Multi-Asset Portfolio Optimization
# Covers: PSX Stocks, International ETFs, Gold, MUFAP Mutual Funds, T-Bills/PIBs

import os
import time
import logging
import requests
import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime
from pypfopt import EfficientFrontier, risk_models, expected_returns
from pypfopt.exceptions import OptimizationError

logger = logging.getLogger(__name__)

# ════════════════════════════════════════════════════════════
# 1. ASSET UNIVERSE
# ════════════════════════════════════════════════════════════

ASSET_UNIVERSE = {
    "PSX_STOCKS": {
        "OGDC.KA":  {"name": "Oil & Gas Dev Corp",   "sector": "Energy"},
        "HBL.KA":   {"name": "Habib Bank Ltd",        "sector": "Banking"},
        "LUCK.KA":  {"name": "Lucky Cement",          "sector": "Materials"},
        "ENGRO.KA": {"name": "Engro Corporation",     "sector": "Conglomerate"},
        "PSO.KA":   {"name": "Pakistan State Oil",    "sector": "Energy"},
        "HUBC.KA":  {"name": "Hub Power Company",     "sector": "Utilities"},
        "MCB.KA":   {"name": "MCB Bank",              "sector": "Banking"},
        "SYS.KA":   {"name": "Systems Ltd",           "sector": "Technology"},
        "TRG.KA":   {"name": "TRG Pakistan",          "sector": "Technology"},
        "MEBL.KA":  {"name": "Meezan Bank",           "sector": "Banking"},
    },
    "INTL_ETFs": {
        "VTI":  {"name": "Vanguard Total Market ETF"},
        "QQQ":  {"name": "Invesco Nasdaq 100 ETF"},
        "VWO":  {"name": "Vanguard Emerging Markets ETF"},
        "VNQ":  {"name": "Vanguard Real Estate ETF"},
        "GLD":  {"name": "SPDR Gold Shares ETF"},
        "AGG":  {"name": "iShares Core US Bond ETF"},
    },
    "COMMODITIES": {
        "GC=F": {"name": "Gold (Troy Oz)", "unit": "tola"},
    },
    "MUTUAL_FUNDS": {
        "ABL_INCOME":   {"name": "ABL Income Fund",         "amc": "ABL AMC",       "category": "Income",        "risk": "Moderate"},
        "HBL_STOCK":    {"name": "HBL Stock Fund",          "amc": "HBL AMC",       "category": "Equity",        "risk": "Aggressive"},
        "UBL_LIQUID":   {"name": "UBL Liquidity Plus Fund", "amc": "UBL Fund Mgrs", "category": "Money Market",  "risk": "Conservative"},
        "NAFA_STOCK":   {"name": "NAFA Stock Fund",         "amc": "NAFA",          "category": "Equity",        "risk": "Aggressive"},
        "JS_INCOME":    {"name": "JS Income Fund",          "amc": "JS Investments","category": "Income",        "risk": "Moderate"},
    },
    "BONDS": {
        "TBILL_3M":  {"name": "T-Bill 3 Month",  "tenure_months": 3,  "return_pa": 21.5, "min_invest_pkr": 10000},
        "TBILL_6M":  {"name": "T-Bill 6 Month",  "tenure_months": 6,  "return_pa": 21.8, "min_invest_pkr": 10000},
        "TBILL_12M": {"name": "T-Bill 12 Month", "tenure_months": 12, "return_pa": 22.1, "min_invest_pkr": 10000},
        "PIB_3Y":    {"name": "PIB 3 Year",      "tenure_months": 36, "return_pa": 17.5, "min_invest_pkr": 100000},
        "PIB_5Y":    {"name": "PIB 5 Year",      "tenure_months": 60, "return_pa": 16.8, "min_invest_pkr": 100000},
    },
}

# ════════════════════════════════════════════════════════════
# 2. RISK ALLOCATION RULES
# ════════════════════════════════════════════════════════════

RISK_ALLOCATION = {
    "Conservative": {"bonds": 0.45, "gold": 0.15, "mutual": 0.10, "stocks": 0.30},
    "Moderate":     {"bonds": 0.20, "gold": 0.10, "mutual": 0.10, "stocks": 0.60},
    "Aggressive":   {"bonds": 0.05, "gold": 0.05, "mutual": 0.05, "stocks": 0.85},
}

# ════════════════════════════════════════════════════════════
# 3. MARKET DATA FETCHING
# ════════════════════════════════════════════════════════════

_price_cache = {}
CACHE_TTL    = 300


def get_price(symbol: str, market: str = "INTL") -> float | None:
    if symbol in _price_cache:
        price, ts = _price_cache[symbol]
        if time.time() - ts < CACHE_TTL:
            return price

    ticker_sym = f"{symbol}.KA" if market == "PSX" and ".KA" not in symbol else symbol
    try:
        ticker = yf.Ticker(ticker_sym)
        price  = ticker.fast_info.get("last_price") or ticker.fast_info.get("regularMarketPrice")
        if price and price > 0:
            _price_cache[symbol] = (float(price), time.time())
            return float(price)
        hist = ticker.history(period="5d")
        if not hist.empty:
            price = float(hist["Close"].iloc[-1])
            _price_cache[symbol] = (price, time.time())
            return price
    except Exception as e:
        logger.warning(f"yFinance failed for {ticker_sym}: {e}")
    return None


def get_pkr_usd_rate() -> float:
    try:
        rate = yf.Ticker("USDPKR=X").fast_info.get("last_price")
        if rate and rate > 0:
            return float(rate)
    except Exception as e:
        logger.warning(f"PKR rate fetch failed: {e}")
    return 278.0


def get_historical_prices(symbols: list, period: str = "1y") -> pd.DataFrame:
    if not symbols:
        return pd.DataFrame()
    try:
        raw = yf.download(symbols, period=period, auto_adjust=True, progress=False)
        prices = raw["Close"] if isinstance(raw.columns, pd.MultiIndex) else raw
        threshold = int(len(prices) * 0.8)
        prices = prices.dropna(thresh=threshold, axis=1)
        prices = prices.ffill().bfill()
        return prices
    except Exception as e:
        logger.error(f"Historical data download failed: {e}")
        return pd.DataFrame()


def get_gold_pkr() -> dict:
    gold_usd = get_price("GC=F")
    pkr_rate = get_pkr_usd_rate()
    if not gold_usd:
        return {}
    gold_pkr_oz   = gold_usd * pkr_rate
    gold_pkr_gram = gold_pkr_oz / 31.1035
    gold_pkr_tola = gold_pkr_gram * 11.6638
    return {
        "price_usd_per_oz":   round(gold_usd, 2),
        "price_pkr_per_oz":   round(gold_pkr_oz, 2),
        "price_pkr_per_gram": round(gold_pkr_gram, 2),
        "price_pkr_per_tola": round(gold_pkr_tola, 2),
        "pkr_usd_rate":       round(pkr_rate, 2),
    }


def get_mufap_nav() -> dict:
    FALLBACK_NAVs = {
        "ABL_INCOME": 115.30, "HBL_STOCK": 89.75, "UBL_LIQUID": 108.90,
        "NAFA_STOCK": 94.20, "JS_INCOME": 112.60,
    }
    try:
        resp = requests.get("https://www.mufap.com.pk/nav_returns_fund.php",
                            timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        if resp.status_code == 200:
            pass  # TODO: parse MUFAP HTML table
    except Exception as e:
        logger.warning(f"MUFAP fetch failed: {e}")
    return FALLBACK_NAVs


def get_sbp_bond_rates() -> dict:
    return {"TBILL_3M": 21.50, "TBILL_6M": 21.80, "TBILL_12M": 22.10, "PIB_3Y": 17.50, "PIB_5Y": 16.80}


# ════════════════════════════════════════════════════════════
# 4. MPT OPTIMISATION (Stocks + ETFs only)
# ════════════════════════════════════════════════════════════

def optimise_stocks(symbols: list, risk_level: str, max_weight: float = 0.30, min_weight: float = 0.02) -> dict:
    if not symbols:
        return {}
    if len(symbols) < 2:
        return {symbols[0]: 1.0}

    prices = get_historical_prices(symbols, period="1y")
    if prices.empty or len(prices.columns) < 2:
        logger.warning("Not enough price data — using equal weights")
        eq = 1.0 / len(symbols)
        return {s: round(eq, 6) for s in symbols}

    try:
        mu = expected_returns.mean_historical_return(prices)
        S  = risk_models.sample_cov(prices)
        ef = EfficientFrontier(mu, S, weight_bounds=(min_weight, max_weight))

        if risk_level == "Conservative":
            ef.min_volatility()
        elif risk_level == "Moderate":
            ef.max_sharpe(risk_free_rate=0.05)
        else:
            try:
                ef.efficient_return(target_return=0.25)
            except OptimizationError:
                ef.max_sharpe(risk_free_rate=0.05)

        weights = ef.clean_weights()
        perf = ef.portfolio_performance(verbose=False)
        logger.info(f"MPT [{risk_level}] Return={perf[0]:.2%} Vol={perf[1]:.2%} Sharpe={perf[2]:.2f}")
        return {sym: round(w, 6) for sym, w in weights.items() if w > 0.001}

    except Exception as e:
        logger.error(f"MPT failed: {e} — using equal weights")
        eq = 1.0 / len(prices.columns)
        return {s: round(eq, 6) for s in prices.columns}


# ════════════════════════════════════════════════════════════
# 5. MASTER PORTFOLIO OPTIMISATION
# ════════════════════════════════════════════════════════════

def optimise_pakistan_portfolio(
    risk_level: str, total_pkr: float,
    include_gold: bool = True, include_bonds: bool = True,
    include_mutual: bool = False, include_psx: bool = True, include_intl: bool = True,
) -> dict:
    alloc = RISK_ALLOCATION[risk_level]
    pkr_rate = get_pkr_usd_rate()
    allocations = {}

    # STEP 1: Build stock/ETF symbol list
    stock_symbols = []
    if include_psx:
        stock_symbols += list(ASSET_UNIVERSE["PSX_STOCKS"].keys())
    if include_intl:
        stock_symbols += list(ASSET_UNIVERSE["INTL_ETFs"].keys())

    # STEP 2: Run MPT on stocks/ETFs
    stock_alloc_pkr = total_pkr * alloc["stocks"]
    if stock_symbols:
        raw_weights = optimise_stocks(stock_symbols, risk_level)
        for sym, w in raw_weights.items():
            amount_pkr = stock_alloc_pkr * w
            is_psx = sym.endswith(".KA")
            mkt = "PSX" if is_psx else "INTL"
            price_raw = get_price(sym, market=mkt)
            if price_raw is None:
                continue
            price_pkr = price_raw if is_psx else price_raw * pkr_rate
            quantity = amount_pkr / price_pkr if price_pkr > 0 else 0
            info = ASSET_UNIVERSE["PSX_STOCKS"].get(sym) or ASSET_UNIVERSE["INTL_ETFs"].get(sym) or {}
            allocations[sym] = {
                "weight": round(w * alloc["stocks"], 6), "amount_pkr": round(amount_pkr, 2),
                "asset_class": "PSX_STOCK" if is_psx else "INTL_ETF",
                "name": info.get("name", sym), "sector": info.get("sector", ""),
                "current_price_pkr": round(price_pkr, 2),
                "current_price_usd": round(price_raw, 4) if not is_psx else None,
                "quantity": round(quantity, 4), "market": mkt,
            }

    # STEP 3: Gold allocation
    if include_gold and alloc["gold"] > 0:
        gold_alloc_pkr = total_pkr * alloc["gold"]
        gold_data = get_gold_pkr()
        if gold_data:
            tola_price = gold_data["price_pkr_per_tola"]
            allocations["GOLD"] = {
                "weight": round(alloc["gold"], 6), "amount_pkr": round(gold_alloc_pkr, 2),
                "asset_class": "COMMODITY", "name": "Gold (24K)", "sector": "Commodity",
                "current_price_pkr": round(tola_price, 2),
                "current_price_usd": gold_data.get("price_usd_per_oz"),
                "quantity": round(gold_alloc_pkr / tola_price, 4), "unit": "tola", "market": "COMMODITY",
            }

    # STEP 4: Bond / T-Bill allocation
    if include_bonds and alloc["bonds"] > 0:
        bond_alloc_pkr = total_pkr * alloc["bonds"]
        bond_rates = get_sbp_bond_rates()
        bond_key = {"Conservative": "TBILL_12M", "Moderate": "TBILL_12M", "Aggressive": "TBILL_3M"}[risk_level]
        bond_info = ASSET_UNIVERSE["BONDS"][bond_key]
        annual_yield = bond_rates.get(bond_key, bond_info["return_pa"]) / 100
        allocations[bond_key] = {
            "weight": round(alloc["bonds"], 6), "amount_pkr": round(bond_alloc_pkr, 2),
            "asset_class": "BOND", "name": bond_info["name"], "sector": "Fixed Income",
            "annual_yield_pct": round(annual_yield * 100, 2),
            "expected_return_pkr": round(bond_alloc_pkr * annual_yield, 2),
            "tenure_months": bond_info["tenure_months"],
            "current_price_pkr": 100.0, "quantity": round(bond_alloc_pkr / 100, 2), "market": "PKR_BOND",
        }

    # STEP 5: Mutual Fund allocation
    if include_mutual and alloc["mutual"] > 0:
        mutual_alloc_pkr = total_pkr * alloc["mutual"]
        nav_data = get_mufap_nav()
        fund_key = {"Conservative": "UBL_LIQUID", "Moderate": "ABL_INCOME", "Aggressive": "HBL_STOCK"}[risk_level]
        fund_info = ASSET_UNIVERSE["MUTUAL_FUNDS"][fund_key]
        nav = nav_data.get(fund_key, 100.0)
        allocations[fund_key] = {
            "weight": round(alloc["mutual"], 6), "amount_pkr": round(mutual_alloc_pkr, 2),
            "asset_class": "MUTUAL_FUND", "name": fund_info["name"], "sector": "Mutual Fund",
            "amc": fund_info["amc"], "category": fund_info["category"],
            "current_price_pkr": round(nav, 4), "quantity": round(mutual_alloc_pkr / nav, 4), "market": "MUFAP",
        }

    # STEP 6: Normalise weights
    total_weight = sum(a["weight"] for a in allocations.values())
    if total_weight > 0:
        for sym in allocations:
            allocations[sym]["weight"] = round(allocations[sym]["weight"] / total_weight, 6)

    # STEP 7: Breakdown
    breakdown = {}
    for data in allocations.values():
        ac = data["asset_class"]
        breakdown[ac] = round(breakdown.get(ac, 0) + data["amount_pkr"], 2)

    # STEP 8: Blended return
    blended_return = _estimate_blended_return(alloc, risk_level)

    return {
        "allocations": allocations,
        "summary": {
            "total_pkr": round(total_pkr, 2), "risk_level": risk_level,
            "num_assets": len(allocations), "pkr_usd_rate": round(pkr_rate, 2),
            "asset_class_breakdown": breakdown,
            "expected_annual_return_pct": round(blended_return * 100, 2),
        },
        "generated_at": datetime.now().isoformat(),
    }


def _estimate_blended_return(alloc: dict, risk_level: str) -> float:
    bond_rates = get_sbp_bond_rates()
    STOCK_RETURNS = {"Conservative": 0.12, "Moderate": 0.18, "Aggressive": 0.25}
    returns = {
        "stocks": STOCK_RETURNS[risk_level], "bonds": bond_rates.get("TBILL_12M", 22.1) / 100,
        "gold": 0.08, "mutual": 0.12,
    }
    return sum(alloc[k] * returns[k] for k in alloc)


# ════════════════════════════════════════════════════════════
# 7. PORTFOLIO PERFORMANCE (for existing holdings)
# ════════════════════════════════════════════════════════════

def calculate_portfolio_performance(holdings: list) -> dict:
    pkr_rate = get_pkr_usd_rate()
    total_current = 0.0
    total_cost = 0.0
    enriched = []

    for h in holdings:
        sym = h["symbol"]
        mkt = h.get("market", "INTL")
        qty = float(h["quantity"])
        avg_buy = float(h["avg_buy_price"])
        asset_class = h.get("asset_class", "")

        if asset_class == "BOND":
            bond_info = ASSET_UNIVERSE["BONDS"].get(sym, {})
            annual_yield = bond_info.get("return_pa", 22.1) / 100
            cost_pkr = avg_buy * qty
            current_pkr = cost_pkr * (1 + annual_yield / 12)
            enriched.append({**h, "current_price_pkr": round(avg_buy, 2),
                "current_value_pkr": round(current_pkr, 2), "cost_basis_pkr": round(cost_pkr, 2),
                "gain_loss_pkr": round(current_pkr - cost_pkr, 2),
                "gain_loss_pct": round(annual_yield / 12 * 100, 4)})
            total_current += current_pkr
            total_cost += cost_pkr
            continue

        if asset_class == "MUTUAL_FUND":
            nav_data = get_mufap_nav()
            nav = nav_data.get(sym, avg_buy)
            current_pkr = nav * qty
            cost_pkr = avg_buy * qty
            enriched.append({**h, "current_price_pkr": round(nav, 4),
                "current_value_pkr": round(current_pkr, 2), "cost_basis_pkr": round(cost_pkr, 2),
                "gain_loss_pkr": round(current_pkr - cost_pkr, 2),
                "gain_loss_pct": round((nav - avg_buy) / avg_buy * 100, 2) if avg_buy > 0 else 0})
            total_current += current_pkr
            total_cost += cost_pkr
            continue

        if sym == "GOLD":
            gold_data = get_gold_pkr()
            tola_price = gold_data.get("price_pkr_per_tola", avg_buy)
            current_pkr = tola_price * qty
            cost_pkr = avg_buy * qty
            enriched.append({**h, "current_price_pkr": round(tola_price, 2),
                "current_value_pkr": round(current_pkr, 2), "cost_basis_pkr": round(cost_pkr, 2),
                "gain_loss_pkr": round(current_pkr - cost_pkr, 2),
                "gain_loss_pct": round((tola_price - avg_buy) / avg_buy * 100, 2) if avg_buy > 0 else 0})
            total_current += current_pkr
            total_cost += cost_pkr
            continue

        price_raw = get_price(sym, market=mkt)
        if price_raw is None:
            price_raw = avg_buy
            
        buy_pkr_rate = float(h.get("avg_buy_pkr_rate", 278.0))
        is_psx = mkt == "PSX" or sym.endswith(".KA")

        if is_psx:
            price_pkr = price_raw
            avg_buy_pkr = avg_buy
            current_val = price_pkr * qty
            cost_basis = avg_buy_pkr * qty
            stock_gain = price_pkr - avg_buy_pkr
            fx_gain_pkr = 0
        else:
            current_price_usd = price_raw
            price_pkr = current_price_usd * pkr_rate
            avg_buy_pkr = avg_buy * buy_pkr_rate
            current_val = price_pkr * qty
            cost_basis = avg_buy_pkr * qty
            stock_gain_usd = current_price_usd - avg_buy
            fx_gain_pkr = avg_buy * (pkr_rate - buy_pkr_rate) * qty

        gain_loss_pkr = current_val - cost_basis
        gain_loss_pct = (gain_loss_pkr / cost_basis * 100) if cost_basis > 0 else 0

        enriched.append({
            **h,
            "current_price_pkr": round(price_pkr, 2),
            "current_price_usd": round(price_raw, 4) if not is_psx else None,
            "current_value_pkr": round(current_val, 2),
            "cost_basis_pkr": round(cost_basis, 2),
            "gain_loss_pkr": round(gain_loss_pkr, 2),
            "gain_loss_pct": round(gain_loss_pct, 2),
            "fx_gain_pkr": round(fx_gain_pkr, 2) if not is_psx else 0,
            "current_pkr_rate": round(pkr_rate, 2),
            "buy_pkr_rate": round(buy_pkr_rate, 2),
        })
        total_current += current_val
        total_cost += cost_basis

    total_gain = total_current - total_cost
    return {
        "holdings": enriched, "total_value_pkr": round(total_current, 2),
        "total_cost_pkr": round(total_cost, 2), "total_gain_pkr": round(total_gain, 2),
        "total_gain_pct": round(total_gain / total_cost * 100, 2) if total_cost > 0 else 0.0,
        "pkr_usd_rate": round(pkr_rate, 2), "as_of": datetime.now().isoformat(),
    }
