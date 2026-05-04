from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","))

# ── Register blueprints ──────────────────────────────────────────────────────
from routes.shap_explainer import shap_bp
from routes.tax_loss import tax_bp

app.register_blueprint(shap_bp, url_prefix="/api")
app.register_blueprint(tax_bp, url_prefix="/api")


# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok", "service": "finai-backend"}


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("FLASK_DEBUG", "true").lower() == "true",
    )
