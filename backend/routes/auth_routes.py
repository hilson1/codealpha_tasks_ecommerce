from flask import Blueprint, request, jsonify, current_app
from config.db import mongo
from bson import ObjectId
import bcrypt, jwt, datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data     = request.get_json()
    name     = data.get("name", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    user_id = mongo.db.users.insert_one({
        "name":     name,
        "email":    email,
        "password": hashed,
        "cart":     []
    }).inserted_id

    token = jwt.encode({
        "id":  str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, current_app.config["JWT_SECRET"], algorithm="HS256")

    return jsonify({
        "token": token,
        "user":  {"id": str(user_id), "name": name, "email": email}
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"message": "Invalid credentials"}), 400

    token = jwt.encode({
        "id":  str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, current_app.config["JWT_SECRET"], algorithm="HS256")

    return jsonify({
        "token": token,
        "user":  {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    })