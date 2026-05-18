import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from db import supabase

logger = logging.getLogger(__name__)

goals_bp = Blueprint("goals", __name__)

def get_current_user_id():
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            return user_id
    except Exception:
        pass
        
    # Fallback to the first user in the DB for local testing without full auth integration
    result = supabase.table("users").select("id").limit(1).execute()
    if result.data:
        return result.data[0]["id"]
    return None

@goals_bp.route("/goals", methods=["GET"])
def get_goals():
    try:
        user_id = get_current_user_id()
        if not user_id: return jsonify({"error": "No users found in database"}), 404
        
        result = supabase.table("goals").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return jsonify({"goals": result.data}), 200
    except Exception as e:
        logger.error(f"Error fetching goals: {e}")
        return jsonify({"error": str(e)}), 500

@goals_bp.route("/goals", methods=["POST"])
def create_goal():
    try:
        user_id = get_current_user_id()
        if not user_id: return jsonify({"error": "No users found in database"}), 404
        
        data = request.get_json()
        
        required_fields = ["name", "target_pkr"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
                
        new_goal = {
            "user_id": user_id,
            "name": data["name"],
            "target_pkr": float(data["target_pkr"]),
            "current_pkr": float(data.get("current_pkr") or 0),
            "deadline": data.get("deadline") if data.get("deadline") else None,
            "icon": data.get("icon", "Target"),
            "priority": data.get("priority", "medium")
        }
        
        result = supabase.table("goals").insert(new_goal).execute()
        if not result.data:
            return jsonify({"error": "Failed to create goal"}), 500
            
        return jsonify({"message": "Goal created successfully", "goal": result.data[0]}), 201
    except Exception as e:
        logger.error(f"Error creating goal: {e}")
        return jsonify({"error": str(e)}), 500

@goals_bp.route("/goals/<goal_id>", methods=["PUT"])
def update_goal(goal_id):
    try:
        user_id = get_current_user_id()
        if not user_id: return jsonify({"error": "No users found in database"}), 404
        
        data = request.get_json()
        
        # Verify ownership
        check = supabase.table("goals").select("id").eq("id", goal_id).eq("user_id", user_id).execute()
        if not check.data:
            return jsonify({"error": "Goal not found or unauthorized"}), 404
            
        update_data = {}
        if "name" in data: update_data["name"] = data["name"]
        if "target_pkr" in data: update_data["target_pkr"] = float(data["target_pkr"])
        if "current_pkr" in data: update_data["current_pkr"] = float(data["current_pkr"])
        if "deadline" in data: update_data["deadline"] = data["deadline"] if data["deadline"] else None
        if "icon" in data: update_data["icon"] = data["icon"]
        if "priority" in data: update_data["priority"] = data["priority"]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
            
        result = supabase.table("goals").update(update_data).eq("id", goal_id).eq("user_id", user_id).execute()
        
        return jsonify({"message": "Goal updated successfully", "goal": result.data[0]}), 200
    except Exception as e:
        logger.error(f"Error updating goal: {e}")
        return jsonify({"error": str(e)}), 500

@goals_bp.route("/goals/<goal_id>", methods=["DELETE"])
def delete_goal(goal_id):
    try:
        user_id = get_current_user_id()
        if not user_id: return jsonify({"error": "No users found in database"}), 404
        
        # Verify ownership and delete
        result = supabase.table("goals").delete().eq("id", goal_id).eq("user_id", user_id).execute()
        
        if not result.data:
             return jsonify({"error": "Goal not found or unauthorized"}), 404
             
        return jsonify({"message": "Goal deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting goal: {e}")
        return jsonify({"error": str(e)}), 500
