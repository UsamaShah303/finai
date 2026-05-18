"""
Portfolio optimisation and holdings routes.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.portfolio import optimise
from services.market import get_price

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/portfolio/optimise", methods=["POST"])
@jwt_required()
def optimise_portfolio():
    """
    Run MPT optimisation for the user.
    Body: { "symbols": ["SPY","BND","GLD","VWO","VXUS","VNQ"], "risk_level": "Moderate" }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    symbols = data.get("symbols", ["SPY", "BND", "GLD", "VWO", "VXUS", "VNQ"])
    risk_level = data.get("risk_level")

    # If no risk_level provided, fetch from DB
    if not risk_level:
        profile = supabase.table("risk_profiles").select("risk_level").eq("user_id", user_id).execute()
        risk_level = profile.data[0]["risk_level"] if profile.data else "Moderate"

    result = optimise(symbols=symbols, risk_level=risk_level)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200


@portfolio_bp.route("/portfolio/holdings", methods=["GET"])
@jwt_required()
def get_holdings():
    """Return user's current virtual holdings with live prices."""
    user_id = get_jwt_identity()

    result = supabase.table("virtual_holdings") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    holdings = result.data or []

    # Enrich with live prices
    for h in holdings:
        live_price = get_price(h["symbol"], h.get("market", "INTL"))
        if live_price:
            h["current_price"] = live_price
            h["market_value"] = round(live_price * float(h.get("quantity", 0)), 2)
            avg = float(h.get("avg_buy_price", 0))
            if avg > 0:
                h["gain_pct"] = round(((live_price - avg) / avg) * 100, 2)
            else:
                h["gain_pct"] = 0.0

    return jsonify({"holdings": holdings}), 200
