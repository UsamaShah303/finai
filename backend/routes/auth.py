"""
Authentication routes — register, login, and profile.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
import bcrypt
from db import supabase

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user, create wallet, return JWT."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "")
    country = data.get("country", "Pakistan")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Check if email already exists
    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return jsonify({"error": "Email already registered"}), 409

    # Hash password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Insert user
    result = supabase.table("users").insert({
        "email": email,
        "password_hash": hashed,
        "name": name,
        "country": country,
    }).execute()

    if not result.data:
        return jsonify({"error": "Failed to create user"}), 500

    user = result.data[0]
    user_id = user["id"]

    # Create empty wallet
    supabase.table("virtual_wallets").insert({
        "user_id": user_id,
        "balance_pkr": 0,
        "balance_usd": 0,
    }).execute()

    # Generate JWT
    token = create_access_token(identity=user_id)

    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user.get("name", ""),
            "country": user.get("country", "Pakistan"),
            "created_at": user.get("created_at"),
        },
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate and return JWT."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user
    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        return jsonify({"error": "Invalid credentials"}), 401

    user = result.data[0]

    # Verify password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    # Check for risk profile
    risk = supabase.table("risk_profiles").select("*").eq("user_id", user["id"]).execute()
    risk_profile = risk.data[0] if risk.data else None

    token = create_access_token(identity=user["id"])

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "country": user.get("country", "Pakistan"),
            "created_at": user.get("created_at"),
            "risk_profile": risk_profile,
        },
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Return current user profile."""
    user_id = get_jwt_identity()

    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        return jsonify({"error": "User not found"}), 404

    user = result.data[0]

    # Get risk profile
    risk = supabase.table("risk_profiles").select("*").eq("user_id", user_id).execute()
    risk_profile = risk.data[0] if risk.data else None

    # Get wallet
    wallet = supabase.table("virtual_wallets").select("*").eq("user_id", user_id).execute()
    wallet_data = wallet.data[0] if wallet.data else None

    return jsonify({
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "country": user.get("country", "Pakistan"),
            "created_at": user.get("created_at"),
            "risk_profile": risk_profile,
            "wallet": wallet_data,
        },
    }), 200
