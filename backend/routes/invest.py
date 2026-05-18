"""
Master investment endpoint — /api/invest/auto

Orchestrates the full investment pipeline:
1. Read risk profile
2. Run multi-asset portfolio optimisation (PSX + ETFs + Gold + Bonds)
3. Run Monte Carlo forecast
4. Generate SHAP explanations
5. Store holdings in Supabase
6. Return everything in one response
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import supabase
from services.portfolio import optimise_pakistan_portfolio
from services.monte_carlo import monte_carlo
from services.market import get_esg_score
import logging

logger = logging.getLogger(__name__)

invest_bp = Blueprint("invest", __name__)

# SHAP explanation templates (used until real ML model is integrated)
SHAP_TEMPLATES = {
    "SPY": {"name": "US Stocks (S&P 500)", "summary_en": "SPY was recommended because you plan to invest long term.", "summary_ur": "SPY اس لیے تجویز کیا گیا کیونکہ آپ طویل مدت کے لیے سرمایہ کاری کرنا چاہتے ہیں۔", "factors": [{"key": "investment_horizon", "direction": "positive", "value": 0.48}, {"key": "loss_reaction", "direction": "positive", "value": 0.42}], "what_if": [{"scenario": "What if you needed the money in 1-2 years?", "impact": "We would reduce SPY and shift more into bonds."}]},
    "VTI": {"name": "Vanguard Total Market", "summary_en": "VTI provides broad US market exposure.", "summary_ur": "VTI امریکی مارکیٹ کی وسیع نمائندگی فراہم کرتا ہے۔", "factors": [{"key": "diversification", "direction": "positive", "value": 0.45}], "what_if": [{"scenario": "What if US economy slowed?", "impact": "International diversification would protect."}]},
    "QQQ": {"name": "Nasdaq 100 (Tech)", "summary_en": "QQQ gives tech-heavy growth exposure.", "summary_ur": "QQQ ٹیکنالوجی میں ترقی فراہم کرتا ہے۔", "factors": [{"key": "risk_tolerance", "direction": "positive", "value": 0.50}], "what_if": [{"scenario": "What if tech faces regulation?", "impact": "We would reduce QQQ allocation."}]},
    "BND": {"name": "US Bonds", "summary_en": "Bonds add stability and cushion against drops.", "summary_ur": "بانڈز آپ کے پورٹ فولیو کو مستحکم رکھتے ہیں۔", "factors": [{"key": "loss_reaction", "direction": "positive", "value": 0.45}], "what_if": [{"scenario": "What if you were comfortable with bigger swings?", "impact": "We would reduce bonds."}]},
    "AGG": {"name": "US Aggregate Bond", "summary_en": "AGG provides broad bond market stability.", "summary_ur": "AGG وسیع بانڈ مارکیٹ میں استحکام فراہم کرتا ہے۔", "factors": [{"key": "emergency_fund", "direction": "positive", "value": 0.40}], "what_if": [{"scenario": "What if interest rates rose?", "impact": "Bond prices may dip temporarily."}]},
    "GLD": {"name": "Gold ETF", "summary_en": "Gold hedges against currency depreciation.", "summary_ur": "سونا کرنسی کی قدر میں کمی سے حفاظت کرتا ہے۔", "factors": [{"key": "currency", "direction": "concern", "value": 0.35}], "what_if": [{"scenario": "What if PKR was stable?", "impact": "Gold would be less important."}]},
    "GOLD": {"name": "Gold (24K Physical)", "summary_en": "Physical gold in tolas hedges PKR and inflation.", "summary_ur": "سونا مہنگائی اور کرنسی سے حفاظت کرتا ہے۔", "factors": [{"key": "inflation_hedge", "direction": "positive", "value": 0.45}], "what_if": [{"scenario": "What if inflation dropped?", "impact": "We would reduce gold allocation."}]},
    "VWO": {"name": "Emerging Markets", "summary_en": "VWO gives exposure to high-growth economies.", "summary_ur": "VWO ابھرتی ہوئی مارکیٹوں میں سرمایہ کاری فراہم کرتا ہے۔", "factors": [{"key": "investment_horizon", "direction": "positive", "value": 0.40}], "what_if": [{"scenario": "What if EM became volatile?", "impact": "We would shift to stable assets."}]},
    "VNQ": {"name": "Real Estate (REITs)", "summary_en": "VNQ provides real estate exposure with dividends.", "summary_ur": "VNQ رئیل اسٹیٹ میں سرمایہ کاری فراہم کرتا ہے۔", "factors": [{"key": "income", "direction": "positive", "value": 0.35}], "what_if": [{"scenario": "What if interest rates rise?", "impact": "REITs could underperform."}]},
    "TBILL_12M": {"name": "T-Bill 12 Month", "summary_en": "T-Bills provide guaranteed PKR returns at ~22% p.a.", "summary_ur": "ٹی بلز تقریباً 22 فیصد سالانہ منافع دیتے ہیں۔", "factors": [{"key": "safety", "direction": "positive", "value": 0.50}], "what_if": [{"scenario": "What if SBP cuts rates?", "impact": "T-Bill yields would decrease."}]},
    "TBILL_3M": {"name": "T-Bill 3 Month", "summary_en": "Short-term T-Bill for maximum liquidity.", "summary_ur": "قلیل مدتی ٹی بل زیادہ سے زیادہ لیکویڈیٹی فراہم کرتا ہے۔", "factors": [{"key": "liquidity", "direction": "positive", "value": 0.45}], "what_if": [{"scenario": "What if you needed longer tenure?", "impact": "We would use 12M or PIBs."}]},
}


@invest_bp.route("/invest/auto", methods=["POST"])
@jwt_required()
def auto_invest():
    """
    Master endpoint — runs the full investment pipeline.

    Body: {
        "total_pkr": 1000000,
        "monthly_deposit": 50000,
        "years": 10,
        "include_gold": true,
        "include_bonds": true,
        "include_mutual": false,
        "include_psx": true,
        "include_intl": true
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    total_pkr = float(data.get("total_pkr", data.get("total_amount", 1000000)))
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

    # ── Step 2: Run multi-asset portfolio optimisation ─────────────────────
    try:
        portfolio = optimise_pakistan_portfolio(
            risk_level=risk_level,
            total_pkr=total_pkr,
            include_gold=data.get("include_gold", True),
            include_bonds=data.get("include_bonds", True),
            include_mutual=data.get("include_mutual", False),
            include_psx=data.get("include_psx", True),
            include_intl=data.get("include_intl", True),
        )
    except Exception as e:
        logger.error(f"Portfolio optimisation error: {e}")
        errors.append(f"Portfolio: {str(e)}")
        portfolio = None

    # ── Step 3: Monte Carlo forecast ───────────────────────────────────────
    forecast = None
    try:
        exp_return = (portfolio["summary"]["expected_annual_return_pct"] / 100) if portfolio else 0.15
        volatility = 0.12 if risk_level == "Conservative" else (0.18 if risk_level == "Moderate" else 0.25)

        forecast = monte_carlo(
            initial_amount=total_pkr,
            monthly_deposit=monthly_deposit,
            annual_return=exp_return,
            volatility=volatility,
            years=years,
        )

        supabase.table("monte_carlo_results").insert({
            "user_id": user_id,
            "p10": forecast["p10"], "p50": forecast["p50"], "p90": forecast["p90"],
            "params": {
                "initial_amount": total_pkr, "monthly_deposit": monthly_deposit,
                "annual_return": exp_return, "volatility": volatility, "years": years,
            },
            "paths": forecast["paths"][:10],
        }).execute()
    except Exception as e:
        logger.error(f"Monte Carlo error: {e}")
        errors.append(f"Forecast: {str(e)}")

    # ── Step 4: Write holdings + SHAP explanations ─────────────────────────
    shap_results = {}
    if portfolio and portfolio.get("allocations"):
        for sym, alloc_data in portfolio["allocations"].items():
            weight = alloc_data.get("weight", 0)
            if weight <= 0:
                continue

            # Write holding to DB
            try:
                market = alloc_data.get("market", "INTL")
                is_psx = market in ("PSX", "PKR_BOND", "MUFAP", "COMMODITY")
                avg_buy_price = alloc_data.get("current_price_usd") if not is_psx else alloc_data.get("current_price_pkr")
                
                supabase.table("virtual_holdings").upsert({
                    "user_id": user_id,
                    "symbol": sym,
                    "quantity": alloc_data.get("quantity", 0),
                    "avg_buy_price": avg_buy_price,
                    "avg_buy_pkr_rate": portfolio["summary"]["pkr_usd_rate"],
                    "weight": round(weight, 4),
                    "esg_score": None,
                    "market": market,
                    "currency": "PKR" if is_psx else "USD",
                }, on_conflict="user_id,symbol").execute()
            except Exception as e:
                logger.warning(f"Holdings write failed for {sym}: {e}")

            # Generate SHAP explanation
            template = SHAP_TEMPLATES.get(sym, {
                "name": alloc_data.get("name", sym),
                "summary_en": f"{alloc_data.get('name', sym)} was included based on your risk profile.",
                "summary_ur": f"{alloc_data.get('name', sym)} آپ کے رسک پروفائل کی بنیاد پر شامل کیا گیا۔",
                "factors": [], "what_if": [],
            })

            confidence = min(95, int(70 + weight * 100))
            shap_results[sym] = {
                "symbol": sym, "name": template["name"],
                "allocation": f"{round(weight * 100)}%", "confidence": confidence,
                "summary_en": template["summary_en"], "summary_ur": template["summary_ur"],
                "factors": template["factors"], "what_if": template["what_if"],
                "asset_class": alloc_data.get("asset_class", ""),
            }

    # ── Step 5: Return everything ──────────────────────────────────────────
    return jsonify({
        "risk_profile": {"risk_score": risk_profile["risk_score"], "risk_level": risk_level},
        "portfolio": portfolio,
        "forecast": {
            "p10": forecast["p10"] if forecast else None,
            "p50": forecast["p50"] if forecast else None,
            "p90": forecast["p90"] if forecast else None,
            "years": years,
        } if forecast else None,
        "shap_explanations": shap_results,
        "errors": errors if errors else None,
        "generated_at": datetime.utcnow().isoformat(),
    }), 200
