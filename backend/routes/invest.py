"""
Master investment endpoint — /api/invest/auto

Orchestrates the full investment pipeline:
1. Read risk profile
2. Fetch live prices
3. Run MPT optimisation
4. Run Monte Carlo forecast
5. Generate SHAP explanations
6. Store holdings
7. Return everything in one response
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.portfolio import optimise
from services.monte_carlo import monte_carlo
from services.market import get_price, get_pkr_usd_rate, get_esg_score
import json, logging

logger = logging.getLogger(__name__)

invest_bp = Blueprint("invest", __name__)

# Default symbol universe
DEFAULT_SYMBOLS = ["SPY", "VXUS", "BND", "GLD", "VWO", "VNQ"]

# SHAP explanation templates (used until real ML model is integrated)
SHAP_TEMPLATES = {
    "SPY": {
        "name": "US Stocks (S&P 500)",
        "summary_en": "SPY was recommended because you plan to invest long term and stay calm during market drops.",
        "summary_ur": "SPY اس لیے تجویز کیا گیا کیونکہ آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں۔",
        "factors": [
            {"key": "investment_horizon", "direction": "positive", "value": 0.48},
            {"key": "loss_reaction", "direction": "positive", "value": 0.42},
            {"key": "esg", "direction": "positive", "value": 0.25},
        ],
        "what_if": [
            {"scenario": "What if you needed the money in 1-2 years?", "impact": "We would reduce SPY and shift more into bonds."},
        ],
    },
    "VXUS": {
        "name": "International Stocks",
        "summary_en": "VXUS gives you international diversification beyond the US market.",
        "summary_ur": "VXUS آپ کو بین الاقوامی تنوع فراہم کرتا ہے۔",
        "factors": [
            {"key": "diversification", "direction": "positive", "value": 0.45},
            {"key": "investment_horizon", "direction": "positive", "value": 0.35},
        ],
        "what_if": [
            {"scenario": "What if you only wanted US exposure?", "impact": "We would remove VXUS and increase SPY allocation."},
        ],
    },
    "BND": {
        "name": "US Bonds",
        "summary_en": "Bonds add stability and cushion against stock market drops.",
        "summary_ur": "بانڈز آپ کے پورٹ فولیو کو مستحکم رکھتے ہیں۔",
        "factors": [
            {"key": "loss_reaction", "direction": "positive", "value": 0.45},
            {"key": "emergency_fund", "direction": "positive", "value": 0.38},
        ],
        "what_if": [
            {"scenario": "What if you were comfortable with bigger swings?", "impact": "We would reduce bonds and add more growth stocks."},
        ],
    },
    "GLD": {
        "name": "Gold",
        "summary_en": "Gold protects your portfolio during uncertain times and hedges against currency depreciation.",
        "summary_ur": "سونا غیر یقینی وقت میں آپ کے پورٹ فولیو کی حفاظت کرتا ہے۔",
        "factors": [
            {"key": "emergency_fund", "direction": "positive", "value": 0.35},
            {"key": "currency", "direction": "concern", "value": 0.20},
        ],
        "what_if": [
            {"scenario": "What if PKR was very stable?", "impact": "Gold would be less important as a currency hedge."},
        ],
    },
    "VWO": {
        "name": "Emerging Markets",
        "summary_en": "VWO gives exposure to high-growth emerging economies.",
        "summary_ur": "VWO آپ کو ابھرتی ہوئی مارکیٹوں میں سرمایہ کاری فراہم کرتا ہے۔",
        "factors": [
            {"key": "investment_horizon", "direction": "positive", "value": 0.40},
            {"key": "risk_tolerance", "direction": "positive", "value": 0.30},
        ],
        "what_if": [
            {"scenario": "What if emerging markets became very volatile?", "impact": "We would reduce VWO and shift to more stable assets."},
        ],
    },
    "VNQ": {
        "name": "Real Estate (REITs)",
        "summary_en": "VNQ provides real estate exposure with dividend income.",
        "summary_ur": "VNQ رئیل اسٹیٹ میں سرمایہ کاری کے ساتھ ڈیویڈنڈ آمدنی فراہم کرتا ہے۔",
        "factors": [
            {"key": "income", "direction": "positive", "value": 0.35},
            {"key": "diversification", "direction": "positive", "value": 0.30},
        ],
        "what_if": [
            {"scenario": "What if interest rates rise sharply?", "impact": "REITs could underperform; we'd reduce VNQ."},
        ],
    },
}


@invest_bp.route("/invest/auto", methods=["POST"])
@jwt_required()
def auto_invest():
    """
    Master endpoint that runs the full investment pipeline.

    Optional body: {
        "symbols": ["SPY", "BND", ...],
        "total_amount": 1000000,
        "monthly_deposit": 50000,
        "years": 10
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    symbols = data.get("symbols", DEFAULT_SYMBOLS)
    total_amount = float(data.get("total_amount", 1000000))
    monthly_deposit = float(data.get("monthly_deposit", 50000))
    years = int(data.get("years", 10))

    errors = []

    # ── Step 1: Read risk profile ──────────────────────────────────────────
    risk_result = supabase.table("risk_profiles") \
        .select("*").eq("user_id", user_id).execute()

    if not risk_result.data:
        return jsonify({
            "error": "No risk profile found. Please complete the risk quiz first.",
            "redirect": "/risk-quiz",
        }), 400

    risk_profile = risk_result.data[0]
    risk_level = risk_profile["risk_level"]

    # ── Step 2: Run MPT optimisation ───────────────────────────────────────
    try:
        portfolio = optimise(
            symbols=symbols,
            risk_level=risk_level,
            total_amount=total_amount,
        )
        if "error" in portfolio:
            errors.append(f"Portfolio: {portfolio['error']}")
            portfolio = None
    except Exception as e:
        logger.error(f"Portfolio optimisation error: {e}")
        errors.append(f"Portfolio: {str(e)}")
        portfolio = None

    # ── Step 3: Monte Carlo forecast ───────────────────────────────────────
    try:
        annual_return = portfolio["expected_return"] if portfolio else 0.10
        volatility = portfolio["volatility"] if portfolio else 0.15

        forecast = monte_carlo(
            initial_amount=total_amount,
            monthly_deposit=monthly_deposit,
            annual_return=annual_return,
            volatility=volatility,
            years=years,
        )

        # Store forecast
        supabase.table("monte_carlo_results").insert({
            "user_id": user_id,
            "p10": forecast["p10"],
            "p50": forecast["p50"],
            "p90": forecast["p90"],
            "params": {
                "initial_amount": total_amount,
                "monthly_deposit": monthly_deposit,
                "annual_return": annual_return,
                "volatility": volatility,
                "years": years,
            },
            "paths": forecast["paths"][:10],
        }).execute()
    except Exception as e:
        logger.error(f"Monte Carlo error: {e}")
        errors.append(f"Forecast: {str(e)}")
        forecast = None

    # ── Step 4: Live prices ────────────────────────────────────────────────
    prices = {}
    for sym in symbols:
        p = get_price(sym)
        if p:
            prices[sym] = p

    pkr_rate = get_pkr_usd_rate()

    # ── Step 4b: ESG scores (Finnhub) ──────────────────────────────────────
    esg_scores = {}
    if portfolio and portfolio.get("weights"):
        for sym, weight in portfolio["weights"].items():
            if weight > 0:
                esg_scores[sym] = get_esg_score(sym)

    # ── Step 5: Generate SHAP explanations ─────────────────────────────────
    shap_results = {}
    if portfolio and portfolio.get("weights"):
        for sym, weight in portfolio["weights"].items():
            if weight <= 0:
                continue

            template = SHAP_TEMPLATES.get(sym, {
                "name": sym,
                "summary_en": f"{sym} was included based on your risk profile.",
                "summary_ur": f"{sym} آپ کے رسک پروفائل کی بنیاد پر شامل کیا گیا۔",
                "factors": [],
                "what_if": [],
            })

            confidence = min(95, int(70 + weight * 100))
            shap_entry = {
                "symbol": sym,
                "name": template["name"],
                "allocation": f"{round(weight * 100)}%",
                "confidence": confidence,
                "summary_en": template["summary_en"],
                "summary_ur": template["summary_ur"],
                "factors": template["factors"],
                "what_if": template["what_if"],
            }
            shap_results[sym] = shap_entry

            # Cache in DB
            try:
                supabase.table("shap_cache").upsert({
                    "user_id": user_id,
                    "symbol": sym,
                    "confidence": confidence,
                    "factors": template["factors"],
                    "summary_en": template["summary_en"],
                    "summary_ur": template["summary_ur"],
                    "what_if": template["what_if"],
                    "allocation": f"{round(weight * 100)}%",
                    "name": template["name"],
                    "price_at_calculation": prices.get(sym),
                    "quiz_version": risk_profile.get("id"),
                }, on_conflict="user_id,symbol").execute()
            except Exception as e:
                logger.warning(f"SHAP cache write failed for {sym}: {e}")

    # ── Step 6: Write holdings ─────────────────────────────────────────────
    if portfolio and portfolio.get("weights"):
        for sym, weight in portfolio["weights"].items():
            if weight <= 0:
                continue
            price = prices.get(sym)
            if not price:
                continue

            allocated_amount = total_amount * weight
            quantity = round(allocated_amount / price, 4)

            # Get ESG score for this symbol
            sym_esg = esg_scores.get(sym, {})
            esg_total = sym_esg.get("total")

            try:
                supabase.table("virtual_holdings").upsert({
                    "user_id": user_id,
                    "symbol": sym,
                    "quantity": quantity,
                    "avg_buy_price": price,
                    "weight": round(weight, 4),
                    "esg_score": esg_total,
                    "market": "INTL",
                    "currency": "USD",
                }, on_conflict="user_id,symbol").execute()
            except Exception as e:
                logger.warning(f"Holdings write failed for {sym}: {e}")

    # ── Step 7: Return everything ──────────────────────────────────────────
    return jsonify({
        "risk_profile": {
            "risk_score": risk_profile["risk_score"],
            "risk_level": risk_profile["risk_level"],
        },
        "portfolio": portfolio,
        "forecast": {
            "p10": forecast["p10"] if forecast else None,
            "p50": forecast["p50"] if forecast else None,
            "p90": forecast["p90"] if forecast else None,
            "years": years,
        } if forecast else None,
        "prices": prices,
        "pkr_usd_rate": pkr_rate,
        "esg_scores": esg_scores,
        "shap_explanations": shap_results,
        "errors": errors if errors else None,
        "generated_at": datetime.utcnow().isoformat(),
    }), 200
