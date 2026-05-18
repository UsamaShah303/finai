"""
Portfolio optimisation and holdings routes.
Updated to use multi-asset optimiser (PSX, ETFs, Gold, Bonds, Mutual Funds).
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.portfolio import (
    optimise_pakistan_portfolio,
    calculate_portfolio_performance,
    get_gold_pkr,
    get_sbp_bond_rates,
    get_mufap_nav,
    ASSET_UNIVERSE,
)

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/portfolio/optimise", methods=["POST"])
@jwt_required()
def optimise_portfolio():
    """
    Run multi-asset portfolio optimisation.
    Body: {
        "total_pkr": 1000000,
        "risk_level": "Moderate",          (optional — fetched from DB)
        "include_gold": true,
        "include_bonds": true,
        "include_mutual": false,
        "include_psx": true,
        "include_intl": true
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    total_pkr = float(data.get("total_pkr", 1000000))
    risk_level = data.get("risk_level")

    # If no risk_level provided, fetch from DB
    if not risk_level:
        profile = supabase.table("risk_profiles").select("risk_level").eq("user_id", user_id).execute()
        risk_level = profile.data[0]["risk_level"] if profile.data else "Moderate"

    result = optimise_pakistan_portfolio(
        risk_level=risk_level,
        total_pkr=total_pkr,
        include_gold=data.get("include_gold", True),
        include_bonds=data.get("include_bonds", True),
        include_mutual=data.get("include_mutual", False),
        include_psx=data.get("include_psx", True),
        include_intl=data.get("include_intl", True),
    )

    return jsonify(result), 200


@portfolio_bp.route("/portfolio/holdings", methods=["GET"])
@jwt_required()
def get_holdings():
    """Return user's current virtual holdings with live P&L in PKR."""
    user_id = get_jwt_identity()

    result = supabase.table("virtual_holdings") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    holdings = result.data or []

    if not holdings:
        return jsonify({"holdings": [], "total_value_pkr": 0, "total_gain_pkr": 0}), 200

    perf = calculate_portfolio_performance(holdings)
    return jsonify(perf), 200


@portfolio_bp.route("/portfolio/gold", methods=["GET"])
@jwt_required()
def gold_price():
    """Return live gold price in PKR per tola, gram, and troy oz."""
    data = get_gold_pkr()
    if not data:
        return jsonify({"error": "Could not fetch gold price"}), 500
    return jsonify(data), 200


@portfolio_bp.route("/portfolio/bonds", methods=["GET"])
@jwt_required()
def bond_rates():
    """Return current T-Bill and PIB rates."""
    rates = get_sbp_bond_rates()
    bonds = {}
    for key, rate in rates.items():
        info = ASSET_UNIVERSE["BONDS"].get(key, {})
        bonds[key] = {**info, "current_rate_pa": rate}
    return jsonify({"bonds": bonds}), 200


@portfolio_bp.route("/portfolio/mutual-funds", methods=["GET"])
@jwt_required()
def mutual_fund_navs():
    """Return latest MUFAP mutual fund NAVs."""
    navs = get_mufap_nav()
    funds = {}
    for key, nav in navs.items():
        info = ASSET_UNIVERSE["MUTUAL_FUNDS"].get(key, {})
        funds[key] = {**info, "nav": nav}
    return jsonify({"funds": funds}), 200
