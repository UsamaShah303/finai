"""
FinAI Nexus — Backend API Server

Flask application with JWT authentication, Supabase integration,
and all feature blueprints registered.
"""

from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
import logging

# Load environment variables before anything else
load_dotenv()

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ── App setup ─────────────────────────────────────────────────────────────────
app = Flask(__name__)

# CORS — allow frontend origins
CORS(app, origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","))

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "86400"))
)
jwt = JWTManager(app)


# ── Register blueprints ──────────────────────────────────────────────────────
from routes.auth import auth_bp
from routes.shap_explainer import shap_bp
from routes.tax_loss import tax_bp
from routes.risk import risk_bp
from routes.portfolio import portfolio_bp
from routes.forecast import forecast_bp
from routes.sentiment import sentiment_bp
from routes.invest import invest_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(shap_bp, url_prefix="/api")
app.register_blueprint(tax_bp, url_prefix="/api")
app.register_blueprint(risk_bp, url_prefix="/api")
app.register_blueprint(portfolio_bp, url_prefix="/api")
app.register_blueprint(forecast_bp, url_prefix="/api")
app.register_blueprint(sentiment_bp, url_prefix="/api")
app.register_blueprint(invest_bp, url_prefix="/api")


# ── Health check (no auth required) ──────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health_check():
    """Simple health-check endpoint."""
    # Quick Supabase connectivity test
    db_status = "unknown"
    try:
        from db import supabase
        result = supabase.table("users").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)[:100]}"

    return {
        "status": "ok",
        "service": "finai-backend",
        "database": db_status,
        "endpoints": [
            "POST /api/auth/register",
            "POST /api/auth/login",
            "GET  /api/auth/me",
            "POST /api/risk/submit",
            "GET  /api/risk/profile",
            "POST /api/portfolio/optimise",
            "GET  /api/portfolio/holdings",
            "POST /api/forecast/run",
            "GET  /api/forecast/latest",
            "GET  /api/shap/assets",
            "GET  /api/shap/<symbol>",
            "GET  /api/tax-loss/opportunities",
            "POST /api/tax-loss/harvest",
            "GET  /api/tax-loss/history",
            "POST /api/sentiment/analyse",
            "POST /api/invest/auto",
        ],
    }


# ── JWT error handlers ───────────────────────────────────────────────────────
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {"error": "Token has expired", "code": "token_expired"}, 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {"error": "Invalid token", "code": "invalid_token"}, 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return {"error": "Authorization header missing", "code": "missing_token"}, 401


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    logger.info(f"🚀 FinAI Backend starting on port {port}")
    logger.info(f"📡 CORS origins: {os.getenv('CORS_ORIGINS')}")
    logger.info(f"🔑 JWT configured with {app.config['JWT_ACCESS_TOKEN_EXPIRES']} expiry")

    app.run(host="0.0.0.0", port=port, debug=debug)
