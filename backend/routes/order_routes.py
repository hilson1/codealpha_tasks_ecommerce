from flask import Blueprint, request, jsonify
from config.db import mongo
from middleware.auth import token_required
from bson import ObjectId
import datetime

order_bp = Blueprint("orders", __name__)


def serialize_order(order):
    return {
        "_id": str(order["_id"]),
        "user": str(order["user"]),
        "items": [
            {
                "product": str(item["product"]),
                "name": item["name"],
                "price": item["price"],
                "quantity": item["quantity"],
            }
            for item in order.get("items", [])
        ],
        "totalAmount": order["totalAmount"],
        "status": order["status"],
        "shippingAddress": order.get("shippingAddress", {}),
        "createdAt": order["createdAt"].isoformat(),
    }


@order_bp.route("", methods=["POST"], strict_slashes=False)
@token_required
def place_order():

    data = request.get_json()

    address = data.get("shippingAddress", {})

    user = mongo.db.users.find_one({"_id": ObjectId(request.user_id)})

    cart = user.get("cart", [])

    if not cart:
        return jsonify({"message": "Cart is empty"}), 400

    items = []
    total = 0

    for item in cart:

        product = mongo.db.products.find_one({"_id": item["product"]})

        if product:

            items.append({
                "product": item["product"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"]
            })

            total += product["price"] * item["quantity"]

    order_id = mongo.db.orders.insert_one({
        "user": ObjectId(request.user_id),
        "items": items,
        "totalAmount": total,
        "status": "Pending",
        "shippingAddress": address,
        "createdAt": datetime.datetime.utcnow()
    }).inserted_id

    mongo.db.users.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$set": {"cart": []}}
    )

    order = mongo.db.orders.find_one({"_id": order_id})

    return jsonify(serialize_order(order)), 201


@order_bp.route("", methods=["GET"], strict_slashes=False)
@token_required
def get_orders():

    orders = mongo.db.orders.find(
        {"user": ObjectId(request.user_id)}
    ).sort("createdAt", -1)

    return jsonify([serialize_order(order) for order in orders])