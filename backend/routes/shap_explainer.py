"""
SHAP Explainer route with smart trigger-based caching.

Cache is recalculated only when something meaningful changes:
  - User retook the quiz
  - Price moved > 5%
  - Sentiment changed
  - Portfolio was rebalanced
  - Cache is older than 24 hours
  - User requests a manual refresh

In production, swap the in-memory store for Supabase (schema below).

SQL:
    CREATE TABLE shap_cache (
        id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id               UUID REFERENCES users(id),
        symbol                VARCHAR(20),
        shap_data             JSONB,
        calculated_at         TIMESTAMP,
        price_at_calculation  DECIMAL,
        sentiment             VARCHAR(20),
        quiz_version          INTEGER DEFAULT 1,
        UNIQUE(user_id, symbol)
    );
"""

from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
import json, random

shap_bp = Blueprint("shap", __name__)

# ---------------------------------------------------------------------------
# In-memory cache (replace with Supabase in production)
# ---------------------------------------------------------------------------
_cache: dict[str, dict] = {}


def _cache_key(user_id: str, symbol: str) -> str:
    return f"{user_id}::{symbol}"


# ---------------------------------------------------------------------------
# Stub helpers — replace with real data sources
# ---------------------------------------------------------------------------

def get_current_price(symbol: str) -> float:
    """Stub: return a mock live price."""
    base = {"SPY": 528.40, "PSX-100": 78230.0, "BND/PIB": 72.15, "GLD": 234.80}
    return base.get(symbol, 100.0) * (1 + random.uniform(-0.02, 0.02))


def get_current_sentiment(symbol: str) -> str:
    """Stub: return current sentiment label."""
    return random.choice(["Positive", "Neutral", "Negative"])


def get_quiz_version(user_id: str) -> int:
    """Stub: return quiz version counter for user."""
    return 1


# ---------------------------------------------------------------------------
# SHAP calculation (mock — replace with real ML model)
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
        "summary": "PSX-100 gives you exposure to Pakistan's growing economy in your home currency. Your long investment horizon and calm approach to market drops make this a good fit.",
        "summary_ur": "PSX-100 آپ کو پاکستان کی بڑھتی ہوئی معیشت میں حصہ دیتا ہے۔",
        "factors": [
            {"key": "investment_horizon", "direction": "positive", "value": 0.40},
            {"key": "income", "direction": "positive", "value": 0.35},
            {"key": "loss_reaction", "direction": "positive", "value": 0.30},
            {"key": "volatility", "direction": "concern", "value": 0.22},
        ],
        "what_if": [
            {"scenario": "What if you invested 30%+ of your income?", "impact": "Higher contributions would accelerate your wealth growth in PKR assets significantly."},
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
            {"scenario": "What if you were comfortable with bigger swings?", "impact": "We would reduce bonds and add more growth stocks for potentially higher returns."},
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
            {"scenario": "What if PKR was very stable?", "impact": "Gold would be less important as a currency hedge, but still valuable for diversification."},
        ],
    },
}


def calculate_shap(user_id: str, symbol: str) -> dict:
    """
    In production this runs the actual SHAP model.
    For now returns the template with slight randomness.
    """
    template = SHAP_TEMPLATES.get(symbol, SHAP_TEMPLATES["SPY"])
    # Add small jitter to confidence to simulate recalculation
    result = {**template, "confidence": template["confidence"] + random.randint(-2, 2)}
    return result


# ---------------------------------------------------------------------------
# Should we recalculate?
# ---------------------------------------------------------------------------

SHAP_UPDATE_TRIGGERS = [
    "user_retook_quiz",
    "portfolio_rebalanced",
    "sentiment_changed",
    "price_moved_significantly",
    "esg_score_updated",
    "user_requests_refresh",
]


def should_recalculate(user_id: str, symbol: str, force: bool = False) -> tuple[bool, str]:
    """Return (need_recalc, reason)."""
    if force:
        return True, "user_requests_refresh"

    key = _cache_key(user_id, symbol)
    cached = _cache.get(key)

    if not cached:
        return True, "no_cache"

    last_calc = datetime.fromisoformat(cached["calculated_at"])
    now = datetime.utcnow()

    # Rule 1: older than 24h
    if now - last_calc > timedelta(hours=24):
        return True, "cache_expired"

    # Rule 2: sentiment changed
    if cached.get("sentiment") != get_current_sentiment(symbol):
        return True, "sentiment_changed"

    # Rule 3: price moved > 5%
    old_price = cached.get("price_at_calculation", 0)
    current_price = get_current_price(symbol)
    if old_price > 0:
        change = abs((current_price - old_price) / old_price)
        if change > 0.05:
            return True, "price_moved_significantly"

    # Rule 4: quiz retaken
    if cached.get("quiz_version") != get_quiz_version(user_id):
        return True, "user_retook_quiz"

    return False, "cache_valid"


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

@shap_bp.route("/shap/assets", methods=["GET"])
def list_assets():
    """Return available assets for SHAP explanation."""
    assets = [
        {"symbol": k, "name": v["name"], "allocation": v["allocation"]}
        for k, v in SHAP_TEMPLATES.items()
    ]
    return jsonify(assets), 200


@shap_bp.route("/shap/<symbol>", methods=["GET"])
def get_shap(symbol):
    """
    Return SHAP explanation for a symbol.
    Uses smart caching — only recalculates when triggers fire.
    """
    # In production: user_id = get_jwt_identity()
    user_id = request.args.get("user_id", "demo-user")
    force = request.args.get("refresh", "false").lower() == "true"

    need_recalc, reason = should_recalculate(user_id, symbol, force=force)

    key = _cache_key(user_id, symbol)

    if not need_recalc:
        cached = _cache[key]
        return jsonify({
            **json.loads(cached["shap_data"]),
            "from_cache": True,
            "calculated_at": cached["calculated_at"],
            "cache_reason": "cache_valid",
        }), 200

    # Recalculate
    shap_result = calculate_shap(user_id, symbol)
    now = datetime.utcnow().isoformat()

    _cache[key] = {
        "shap_data": json.dumps(shap_result),
        "calculated_at": now,
        "price_at_calculation": get_current_price(symbol),
        "sentiment": get_current_sentiment(symbol),
        "quiz_version": get_quiz_version(user_id),
    }

    return jsonify({
        **shap_result,
        "from_cache": False,
        "calculated_at": now,
        "cache_reason": reason,
    }), 200
