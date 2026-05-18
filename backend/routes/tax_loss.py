"""
Tax Loss Harvesting route with Supabase-backed holdings and JWT auth.

Scans virtual holdings for unrealised losses > 5%, suggests replacement
assets (wash-sale compliant), and simulates the harvest.
"""

from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.market import get_price
import logging

logger = logging.getLogger(__name__)

tax_bp = Blueprint("tax_loss", __name__)

# ---------------------------------------------------------------------------
# Replacement asset map (wash-sale compliant pairs)
# ---------------------------------------------------------------------------
REPLACEMENTS = {
    "VTI": "SCHB",
    "VOO": "IVV",
    "SPY": "IVV",
    "VEA": "IEFA",
    "VXUS": "IXUS",
    "BND": "AGG",
    "GLD": "IAU",
    "VWO": "IEMG",
    "VNQ": "SCHH",
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
# Helpers
# ---------------------------------------------------------------------------

def calculate_tax_saving(loss_amount: float, country: str) -> dict:
    """Simulate how much tax would be saved."""
    tax_rate = 0.15  # 15% for both PK and US (simplified)
    return {
        "loss_amount": round(loss_amount, 2),
        "tax_rate_pct": tax_rate * 100,
        "simulated_tax_saved": round(loss_amount * tax_rate, 2),
    }


def find_opportunities(holdings: list[dict]) -> list[dict]:
    """Scan holdings for unrealised losses greater than 5%."""
    opps = []
    for h in holdings:
        symbol = h.get("symbol", "")
        shares = float(h.get("quantity", 0))
        avg_buy = float(h.get("avg_buy_price", 0))
        market = h.get("market", "INTL")
        currency = h.get("currency", "USD")

        if shares <= 0 or avg_buy <= 0:
            continue

        # Fetch live price
        current = get_price(symbol, market)
        if not current:
            continue

        loss = (current - avg_buy) * shares
        loss_pct = ((current - avg_buy) / avg_buy) * 100

        if loss_pct < -5:
            replacement = REPLACEMENTS.get(symbol)
            tax = calculate_tax_saving(abs(loss), "PK" if currency == "PKR" else "US")
            opps.append({
                "symbol": symbol,
                "shares": shares,
                "avg_buy_price": avg_buy,
                "current_price": current,
                "loss_amount": round(abs(loss), 2),
                "loss_pct": round(abs(loss_pct), 1),
                "currency": currency,
                "replacement": replacement,
                "replacement_desc": REPLACEMENT_DESCRIPTIONS.get(replacement, ""),
                **tax,
            })
    return opps


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@tax_bp.route("/tax-loss/opportunities", methods=["GET"])
@jwt_required()
def get_opportunities():
    """Scan all user holdings for tax loss harvesting opportunities."""
    user_id = get_jwt_identity()

    # Fetch holdings from Supabase
    result = supabase.table("virtual_holdings") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    holdings = result.data or []

    if not holdings:
        return jsonify({
            "opportunities": [],
            "total_harvestable_loss": 0,
            "total_simulated_tax_saved": 0,
            "count": 0,
            "message": "No holdings found. Use /api/invest/auto to create a portfolio first.",
        }), 200

    opps = find_opportunities(holdings)
    return jsonify({
        "opportunities": opps,
        "total_harvestable_loss": round(sum(o["loss_amount"] for o in opps), 2),
        "total_simulated_tax_saved": round(sum(o["simulated_tax_saved"] for o in opps), 2),
        "count": len(opps),
    }), 200


@tax_bp.route("/tax-loss/harvest", methods=["POST"])
@jwt_required()
def execute_harvest():
    """Simulate a tax loss harvest: sell losing asset, buy replacement."""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    symbol = data.get("symbol")

    if not symbol:
        return jsonify({"error": "symbol is required"}), 400

    # Find the holding in DB
    holding_result = supabase.table("virtual_holdings") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("symbol", symbol) \
        .execute()

    if not holding_result.data:
        return jsonify({"error": f"No holding found for {symbol}"}), 404

    holding = holding_result.data[0]
    shares = float(holding.get("quantity", 0))
    avg_buy = float(holding.get("avg_buy_price", 0))
    market = holding.get("market", "INTL")
    currency = holding.get("currency", "USD")

    current = get_price(symbol, market)
    if not current:
        return jsonify({"error": f"Could not fetch live price for {symbol}"}), 500

    loss = (current - avg_buy) * shares
    if loss >= 0:
        return jsonify({"error": f"{symbol} is not at a loss"}), 400

    replacement = REPLACEMENTS.get(symbol)
    if not replacement:
        return jsonify({"error": f"No replacement asset configured for {symbol}"}), 400

    tax = calculate_tax_saving(abs(loss), "PK" if currency == "PKR" else "US")
    invested = avg_buy * shares

    result = {
        "message": "Tax loss harvest simulated",
        "sold": symbol,
        "bought": replacement,
        "bought_desc": REPLACEMENT_DESCRIPTIONS.get(replacement, ""),
        "loss_harvested": round(abs(loss), 2),
        "tax_saved": tax["simulated_tax_saved"],
        "tax_rate_pct": tax["tax_rate_pct"],
        "invested_amount": round(invested, 2),
        "currency": currency,
        "harvested_at": datetime.now(timezone.utc).isoformat(),
    }

    # Log the harvest as a transaction
    try:
        supabase.table("virtual_transactions").insert({
            "user_id": user_id,
            "symbol": symbol,
            "type": "TAX_HARVEST",
            "amount_pkr": round(abs(loss), 2),
            "quantity": shares,
            "notes": f"Sold {symbol}, bought {replacement}. Tax saved: {tax['simulated_tax_saved']}",
            "simulated_tax_saved": tax["simulated_tax_saved"],
        }).execute()
    except Exception as e:
        logger.warning(f"Failed to log harvest transaction: {e}")

    return jsonify(result), 200


@tax_bp.route("/tax-loss/history", methods=["GET"])
@jwt_required()
def harvest_history():
    """Return past harvest simulations from DB."""
    user_id = get_jwt_identity()

    result = supabase.table("virtual_transactions") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("type", "TAX_HARVEST") \
        .order("created_at", desc=True) \
        .execute()

    return jsonify({"harvests": result.data or []}), 200
