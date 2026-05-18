"""
Sentiment analysis route.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.sentiment import analyse_sentiment

sentiment_bp = Blueprint("sentiment", __name__)


@sentiment_bp.route("/sentiment/analyse", methods=["POST"])
@jwt_required()
def analyse():
    """
    Analyse sentiment of financial headlines.
    Body: { "headlines": ["Fed signals rate cut", "Markets crash on trade war fears"] }
    """
    data = request.get_json() or {}
    headlines = data.get("headlines", [])

    if not headlines or not isinstance(headlines, list):
        return jsonify({"error": "headlines must be a non-empty list of strings"}), 400

    result = analyse_sentiment(headlines)
    return jsonify(result), 200
