"""
Tax Loss Harvesting simulation route.

Scans virtual holdings for unrealised losses > 5%, suggests replacement
assets (wash-sale compliant), and simulates the harvest — selling the
losing position, buying the replacement, and logging the simulated tax
saving.

Supabase schema (for production):

    CREATE TABLE virtual_holdings (
        id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id         UUID REFERENCES users(id),
        symbol          VARCHAR(20),
        shares          DECIMAL,
        avg_buy_price   DECIMAL,
        current_price   DECIMAL,
        invested_amount DECIMAL,
        currency        VARCHAR(5),
        market          VARCHAR(10),
        UNIQUE(user_id, symbol)
    );

    CREATE TABLE virtual_transactions (
        id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id              UUID REFERENCES users(id),
        type                 VARCHAR(30),
        symbol               VARCHAR(20),
        amount               DECIMAL,
        notes                TEXT,
        simulated_tax_saved  DECIMAL,
        created_at           TIMESTAMP DEFAULT now()
    );
"""

from datetime import datetime
from flask import Blueprint, jsonify, request
import copy

tax_bp = Blueprint("tax_loss", __name__)

# ---------------------------------------------------------------------------
# Replacement asset map (wash-sale compliant pairs)
# ---------------------------------------------------------------------------
REPLACEMENTS = {
    # International ETFs
    "VTI": "SCHB",    # Both US total market
    "VOO": "IVV",     # Both S&P 500
    "SPY": "IVV",     # Both S&P 500
    "VEA": "IEFA",    # Both intl developed
    "VXUS": "IXUS",   # Both intl ex-US
    "BND": "AGG",     # Both US bond index
    "GLD": "IAU",     # Both gold ETFs
    "VWO": "IEMG",    # Both emerging markets
    "VNQ": "SCHH",    # Both REITs
    # PSX stocks
    "OGDC": "PPL",
    "ENGRO": "FATIMA",
    "LUCK": "DGKC",
    "HBL": "MCB",
    "PSX-100": "KSE-30",
}

REPLACEMENT_DESCRIPTIONS = {
    "SCHB": "Schwab US Broad Market (similar to VTI)",
    "IVV": "iShares Core S&P 500 (similar to SPY/VOO)",
    "IEFA": "iShares Intl Developed (similar to VEA)",
    "IXUS": "iShares Core Intl (similar to VXUS)",
    "AGG": "iShares US Aggregate Bond (similar to BND)",
    "IAU": "iShares Gold Trust (similar to GLD)",
    "IEMG": "iShares Emerging Markets (similar to VWO)",
    "SCHH": "Schwab US REIT (similar to VNQ)",
    "PPL": "Pakistan Petroleum (similar sector to OGDC)",
    "FATIMA": "Fatima Fertilizer (similar to ENGRO)",
    "DGKC": "D.G. Khan Cement (similar to LUCK)",
    "MCB": "MCB Bank (similar to HBL)",
    "KSE-30": "KSE-30 Index (similar to PSX-100)",
}

# ---------------------------------------------------------------------------
# Mock virtual holdings (replace with Supabase in production)
# ---------------------------------------------------------------------------
MOCK_HOLDINGS = [
    {"symbol": "SPY", "shares": 5, "avg_buy_price": 540.00, "current_price": 528.40, "currency": "USD", "market": "US"},
    {"symbol": "VEA", "shares": 20, "avg_buy_price": 48.50, "current_price": 44.10, "currency": "USD", "market": "INTL"},
    {"symbol": "BND", "shares": 15, "avg_buy_price": 73.20, "current_price": 72.15, "currency": "USD", "market": "US"},
    {"symbol": "GLD", "shares": 8, "avg_buy_price": 220.00, "current_price": 234.80, "currency": "USD", "market": "US"},
    {"symbol": "VWO", "shares": 12, "avg_buy_price": 43.80, "current_price": 40.10, "currency": "USD", "market": "EM"},
    {"symbol": "PSX-100", "shares": 100, "avg_buy_price": 82500.00, "current_price": 78230.00, "currency": "PKR", "market": "PK"},
]

# In-memory store for harvested results (per session)
_harvest_log: list[dict] = []


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def calculate_tax_saving(loss_amount: float, country: str) -> dict:
    """Simulate how much tax would be saved."""
    if country == "PK":
        tax_rate = 0.15  # Pakistan short-term CGT
    else:
        tax_rate = 0.15  # US standard rate
    return {
        "loss_amount": round(loss_amount, 2),
        "tax_rate_pct": tax_rate * 100,
        "simulated_tax_saved": round(loss_amount * tax_rate, 2),
    }


def find_opportunities(holdings: list[dict]) -> list[dict]:
    """Scan holdings for unrealised losses greater than 5%."""
    opps = []
    for h in holdings:
        loss = (h["current_price"] - h["avg_buy_price"]) * h["shares"]
        loss_pct = ((h["current_price"] - h["avg_buy_price"]) / h["avg_buy_price"]) * 100
        if loss_pct < -5:
            replacement = REPLACEMENTS.get(h["symbol"])
            tax = calculate_tax_saving(abs(loss), "PK" if h.get("currency") == "PKR" else "US")
            opps.append({
                "symbol": h["symbol"],
                "shares": h["shares"],
                "avg_buy_price": h["avg_buy_price"],
                "current_price": h["current_price"],
                "loss_amount": round(abs(loss), 2),
                "loss_pct": round(abs(loss_pct), 1),
                "currency": h.get("currency", "USD"),
                "replacement": replacement,
                "replacement_desc": REPLACEMENT_DESCRIPTIONS.get(replacement, ""),
                **tax,
            })
    return opps


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@tax_bp.route("/tax-loss/opportunities", methods=["GET"])
def get_opportunities():
    """Scan all user holdings for tax loss harvesting opportunities (loss > 5%)."""
    # In production: fetch from Supabase for the authenticated user
    opps = find_opportunities(MOCK_HOLDINGS)
    return jsonify({
        "opportunities": opps,
        "total_harvestable_loss": round(sum(o["loss_amount"] for o in opps), 2),
        "total_simulated_tax_saved": round(sum(o["simulated_tax_saved"] for o in opps), 2),
        "count": len(opps),
    }), 200


@tax_bp.route("/tax-loss/harvest", methods=["POST"])
def execute_harvest():
    """Simulate a tax loss harvest: sell losing asset, buy replacement."""
    data = request.get_json() or {}
    symbol = data.get("symbol")
    if not symbol:
        return jsonify({"error": "symbol is required"}), 400

    # Find the holding
    holding = next((h for h in MOCK_HOLDINGS if h["symbol"] == symbol), None)
    if not holding:
        return jsonify({"error": f"No holding found for {symbol}"}), 404

    loss = (holding["current_price"] - holding["avg_buy_price"]) * holding["shares"]
    if loss >= 0:
        return jsonify({"error": f"{symbol} is not at a loss"}), 400

    replacement = REPLACEMENTS.get(symbol)
    if not replacement:
        return jsonify({"error": f"No replacement asset configured for {symbol}"}), 400

    tax = calculate_tax_saving(abs(loss), "PK" if holding.get("currency") == "PKR" else "US")
    invested = holding["avg_buy_price"] * holding["shares"]

    result = {
        "message": "Tax loss harvest simulated",
        "sold": symbol,
        "bought": replacement,
        "bought_desc": REPLACEMENT_DESCRIPTIONS.get(replacement, ""),
        "loss_harvested": round(abs(loss), 2),
        "tax_saved": tax["simulated_tax_saved"],
        "tax_rate_pct": tax["tax_rate_pct"],
        "invested_amount": round(invested, 2),
        "currency": holding.get("currency", "USD"),
        "harvested_at": datetime.utcnow().isoformat(),
    }

    _harvest_log.append(result)
    return jsonify(result), 200


@tax_bp.route("/tax-loss/history", methods=["GET"])
def harvest_history():
    """Return past harvest simulations."""
    return jsonify({"harvests": _harvest_log}), 200
