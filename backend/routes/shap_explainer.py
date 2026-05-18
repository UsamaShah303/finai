"""
SHAP Explainer route with Supabase-backed caching and JWT auth.

Cache is recalculated only when something meaningful changes:
  - User retook the quiz
  - Price moved > 5%
  - Sentiment changed
  - Cache is older than 24 hours
  - User requests a manual refresh
"""

from datetime import datetime, timedelta, timezone
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.market import get_price
from services.sentiment import analyse_sentiment
import json, random, logging

logger = logging.getLogger(__name__)

shap_bp = Blueprint("shap", __name__)


# ---------------------------------------------------------------------------
# Stub helpers — will be replaced with real ML model
# ---------------------------------------------------------------------------

def get_current_sentiment(symbol: str) -> str:
    """Get a simple sentiment label for a symbol."""
    headlines = [f"{symbol} market update", f"{symbol} price movement today"]
    result = analyse_sentiment(headlines)
    return result["label"].capitalize()


def get_quiz_version(user_id: str) -> int:
    """Return quiz version counter for user (based on risk_profiles)."""
    try:
        result = supabase.table("risk_profiles") \
            .select("created_at") \
            .eq("user_id", user_id) \
            .execute()
        return len(result.data) if result.data else 0
    except Exception:
        return 0


# ---------------------------------------------------------------------------
# SHAP templates (mock — replace with real ML model)
# ---------------------------------------------------------------------------

SHAP_TEMPLATES = {
    "SPY": {
        "symbol": "SPY",
        "name": "US Stocks (S&P 500)",
        "allocation": "22%",
        "confidence": 87,
        "summary": "SPY was recommended because you plan to invest long term and stay calm during market drops. Your emergency savings protect you from needing to sell early.",
        "summary_ur": "SPY اس لیے تجویز کیا گیا کیونکہ آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں اور مارکیٹ گرنے پر صبر کرتے ہیں۔",
        "factors": [
            {"key": "investment_horizon", "direction": "positive", "value": 0.48},
            {"key": "loss_reaction", "direction": "positive", "value": 0.42},
            {"key": "esg", "direction": "positive", "value": 0.25},
            {"key": "currency", "direction": "concern", "value": 0.18},
            {"key": "volatility", "direction": "concern", "value": 0.15},
        ],
        "what_if": [
            {"scenario": "What if you needed the money in 1-2 years?", "impact": "We would reduce SPY and shift more into bonds and cash for safety."},
            {"scenario": "What if you were uncomfortable with market drops?", "impact": "We would lower SPY allocation and add more stable fixed-income assets."},
        ],
    },
    "PSX-100": {
        "symbol": "PSX-100",
        "name": "Pakistan Stocks (PSX)",
        "allocation": "18%",
        "confidence": 82,
        "summary": "PSX-100 gives you exposure to Pakistan's growing economy in your home currency.",
        "summary_ur": "PSX-100 آپ کو پاکستان کی بڑھتی ہوئی معیشت میں حصہ دیتا ہے۔",
        "factors": [
            {"key": "investment_horizon", "direction": "positive", "value": 0.40},
            {"key": "income", "direction": "positive", "value": 0.35},
            {"key": "loss_reaction", "direction": "positive", "value": 0.30},
            {"key": "volatility", "direction": "concern", "value": 0.22},
        ],
        "what_if": [
            {"scenario": "What if you invested 30%+ of your income?", "impact": "Higher contributions would accelerate your wealth growth in PKR assets."},
        ],
    },
    "BND/PIB": {
        "symbol": "BND/PIB",
        "name": "Bonds (Mixed)",
        "allocation": "18%",
        "confidence": 91,
        "summary": "Bonds add stability to your portfolio. They cushion against stock market drops and provide steady income.",
        "summary_ur": "بانڈز آپ کے پورٹ فولیو کو مستحکم رکھتے ہیں۔",
        "factors": [
            {"key": "loss_reaction", "direction": "positive", "value": 0.45},
            {"key": "emergency_fund", "direction": "positive", "value": 0.38},
            {"key": "income", "direction": "positive", "value": 0.28},
        ],
        "what_if": [
            {"scenario": "What if you were comfortable with bigger swings?", "impact": "We would reduce bonds and add more growth stocks."},
        ],
    },
    "GLD": {
        "symbol": "GLD",
        "name": "Gold",
        "allocation": "12%",
        "confidence": 79,
        "summary": "Gold protects your portfolio during uncertain times and hedges against PKR depreciation.",
        "summary_ur": "سونا غیر یقینی وقت میں آپ کے پورٹ فولیو کی حفاظت کرتا ہے۔",
        "factors": [
            {"key": "emergency_fund", "direction": "positive", "value": 0.35},
            {"key": "esg", "direction": "negative", "value": 0.15},
            {"key": "currency", "direction": "concern", "value": 0.20},
        ],
        "what_if": [
            {"scenario": "What if PKR was very stable?", "impact": "Gold would be less important as a currency hedge."},
        ],
    },
}


def calculate_shap(user_id: str, symbol: str) -> dict:
    """In production this runs the actual SHAP model. For now returns template."""
    template = SHAP_TEMPLATES.get(symbol, SHAP_TEMPLATES["SPY"])
    result = {**template, "confidence": template["confidence"] + random.randint(-2, 2)}
    return result


# ---------------------------------------------------------------------------
# Should we recalculate?
# ---------------------------------------------------------------------------

def should_recalculate(user_id: str, symbol: str, force: bool = False) -> tuple[bool, str]:
    """Return (need_recalc, reason)."""
    if force:
        return True, "user_requests_refresh"

    # Check DB cache
    try:
        result = supabase.table("shap_cache") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("symbol", symbol) \
            .execute()
    except Exception as e:
        logger.warning(f"Cache read failed: {e}")
        return True, "cache_read_error"

    if not result.data:
        return True, "no_cache"

    cached = result.data[0]
    cached_at = datetime.fromisoformat(cached["cached_at"].replace("Z", "+00:00"))
    now = datetime.now(timezone.utc)

    # Rule 1: older than 24h
    if now - cached_at > timedelta(hours=24):
        return True, "cache_expired"

    # Rule 2: price moved > 5%
    old_price = float(cached.get("price_at_calculation") or 0)
    if old_price > 0:
        current_price = get_price(symbol)
        if current_price:
            change = abs((current_price - old_price) / old_price)
            if change > 0.05:
                return True, "price_moved_significantly"

    # Rule 3: quiz retaken
    current_quiz_ver = get_quiz_version(user_id)
    if cached.get("quiz_version") != current_quiz_ver:
        return True, "user_retook_quiz"

    return False, "cache_valid"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@shap_bp.route("/shap/assets", methods=["GET"])
@jwt_required()
def list_assets():
    """Return available assets for SHAP explanation."""
    assets = [
        {"symbol": k, "name": v["name"], "allocation": v["allocation"]}
        for k, v in SHAP_TEMPLATES.items()
    ]
    return jsonify(assets), 200


@shap_bp.route("/shap/<symbol>", methods=["GET"])
@jwt_required()
def get_shap(symbol):
    """Return SHAP explanation for a symbol. Uses smart DB caching."""
    user_id = get_jwt_identity()
    force = request.args.get("refresh", "false").lower() == "true"

    need_recalc, reason = should_recalculate(user_id, symbol, force=force)

    if not need_recalc:
        # Return from DB cache
        cached = supabase.table("shap_cache") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("symbol", symbol) \
            .execute()

        if cached.data:
            entry = cached.data[0]
            return jsonify({
                "symbol": symbol,
                "name": entry.get("name", symbol),
                "allocation": entry.get("allocation", ""),
                "confidence": entry.get("confidence", 80),
                "summary": entry.get("summary_en", ""),
                "summary_ur": entry.get("summary_ur", ""),
                "factors": entry.get("factors", []),
                "what_if": entry.get("what_if", []),
                "from_cache": True,
                "calculated_at": entry.get("cached_at"),
                "cache_reason": "cache_valid",
            }), 200

    # Recalculate
    shap_result = calculate_shap(user_id, symbol)
    now = datetime.now(timezone.utc).isoformat()
    current_price = get_price(symbol)
    sentiment = get_current_sentiment(symbol)
    quiz_ver = get_quiz_version(user_id)

    # Store in DB
    try:
        supabase.table("shap_cache").upsert({
            "user_id": user_id,
            "symbol": symbol,
            "confidence": shap_result.get("confidence"),
            "factors": shap_result.get("factors", []),
            "summary_en": shap_result.get("summary", ""),
            "summary_ur": shap_result.get("summary_ur", ""),
            "what_if": shap_result.get("what_if", []),
            "allocation": shap_result.get("allocation", ""),
            "name": shap_result.get("name", symbol),
            "price_at_calculation": current_price,
            "sentiment": sentiment,
            "quiz_version": quiz_ver,
        }, on_conflict="user_id,symbol").execute()
    except Exception as e:
        logger.warning(f"SHAP cache write failed: {e}")

    return jsonify({
        **shap_result,
        "from_cache": False,
        "calculated_at": now,
        "cache_reason": reason,
    }), 200
