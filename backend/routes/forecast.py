"""
Monte Carlo forecast routes.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.monte_carlo import monte_carlo

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/forecast/run", methods=["POST"])
@jwt_required()
def run_forecast():
    """
    Run a Monte Carlo simulation.
    Body: {
        "initial_amount": 500000,
        "monthly_deposit": 25000,
        "annual_return": 0.10,
        "volatility": 0.15,
        "years": 10
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    initial = float(data.get("initial_amount", 500000))
    monthly = float(data.get("monthly_deposit", 25000))
    ret = float(data.get("annual_return", 0.10))
    vol = float(data.get("volatility", 0.15))
    years = int(data.get("years", 10))

    result = monte_carlo(
        initial_amount=initial,
        monthly_deposit=monthly,
        annual_return=ret,
        volatility=vol,
        years=years,
        n_paths=10000,
    )

    # Store in DB (without full paths to save space)
    supabase.table("monte_carlo_results").insert({
        "user_id": user_id,
        "p10": result["p10"],
        "p50": result["p50"],
        "p90": result["p90"],
        "params": {
            "initial_amount": initial,
            "monthly_deposit": monthly,
            "annual_return": ret,
            "volatility": vol,
            "years": years,
        },
        # Store only first 10 paths in DB to save space
        "paths": result["paths"][:10],
    }).execute()

    return jsonify(result), 200


@forecast_bp.route("/forecast/latest", methods=["GET"])
@jwt_required()
def latest_forecast():
    """Return the most recent forecast for the user."""
    user_id = get_jwt_identity()

    result = supabase.table("monte_carlo_results") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        return jsonify({"error": "No forecast found. Run one first."}), 404

    return jsonify(result.data[0]), 200
