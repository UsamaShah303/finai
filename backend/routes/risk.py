"""
Risk quiz submission and profile retrieval.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.risk import classify_risk

risk_bp = Blueprint("risk", __name__)


@risk_bp.route("/risk/submit", methods=["POST"])
@jwt_required()
def submit_quiz():
    """
    Accept quiz answers, classify risk, store in DB.
    Body: { "answers": [3, 4, 5, 3, 2, 4, 3, 2, 3, 4] }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    answers = data.get("answers", [])

    if not answers or not isinstance(answers, list):
        return jsonify({"error": "answers must be a list of integers"}), 400

    # Classify
    result = classify_risk(answers)

    # Upsert into risk_profiles (one profile per user)
    supabase.table("risk_profiles").upsert({
        "user_id": user_id,
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "quiz_answers": answers,
    }, on_conflict="user_id").execute()

    return jsonify({
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "answers": answers,
    }), 200


@risk_bp.route("/risk/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Return current user's risk profile."""
    user_id = get_jwt_identity()

    result = supabase.table("risk_profiles").select("*").eq("user_id", user_id).execute()
    if not result.data:
        return jsonify({"error": "No risk profile found. Please complete the quiz."}), 404

    return jsonify(result.data[0]), 200
