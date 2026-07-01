from flask import Blueprint, request, jsonify
from bson import ObjectId

from config.db import mongo
from middleware.auth import token_required

cart_bp = Blueprint("cart", __name__)


def get_populated_cart(user_id):

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    cart = []

    for item in user.get("cart", []):

        product = mongo.db.products.find_one(
            {"_id": item["product"]}
        )

        if product:
            cart.append({
                "productId": str(product["_id"]),
                "name": product["name"],
                "price": product["price"],
                "image": product["image"],
                "quantity": item["quantity"]
            })

    return cart


@cart_bp.route("", methods=["GET"], strict_slashes=False)
@token_required
def get_cart():

    return jsonify(get_populated_cart(request.user_id))


@cart_bp.route("", methods=["POST"], strict_slashes=False)
@token_required
def add_cart():

    data = request.get_json()

    product_id = data.get("productId")
    quantity = int(data.get("quantity", 1))

    user = mongo.db.users.find_one(
        {"_id": ObjectId(request.user_id)}
    )

    cart = user.get("cart", [])

    found = False

    for item in cart:

        if str(item["product"]) == product_id:
            item["quantity"] += quantity
            found = True
            break

    if not found:

        cart.append({
            "product": ObjectId(product_id),
            "quantity": quantity
        })

    mongo.db.users.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$set": {"cart": cart}}
    )

    return jsonify(get_populated_cart(request.user_id))


@cart_bp.route("/<product_id>", methods=["PUT"], strict_slashes=False)
@token_required
def update_cart(product_id):

    data = request.get_json()

    quantity = max(1, int(data.get("quantity", 1)))

    user = mongo.db.users.find_one(
        {"_id": ObjectId(request.user_id)}
    )

    cart = user.get("cart", [])

    for item in cart:

        if str(item["product"]) == product_id:
            item["quantity"] = quantity

    mongo.db.users.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$set": {"cart": cart}}
    )

    return jsonify(get_populated_cart(request.user_id))


@cart_bp.route("/<product_id>", methods=["DELETE"], strict_slashes=False)
@token_required
def remove_cart(product_id):

    user = mongo.db.users.find_one(
        {"_id": ObjectId(request.user_id)}
    )

    cart = [
        item for item in user.get("cart", [])
        if str(item["product"]) != product_id
    ]

    mongo.db.users.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$set": {"cart": cart}}
    )

    return jsonify(get_populated_cart(request.user_id))


@cart_bp.route("/clear", methods=["DELETE"], strict_slashes=False)
@token_required
def clear_cart():

    mongo.db.users.update_one(
        {"_id": ObjectId(request.user_id)},
        {"$set": {"cart": []}}
    )

    return jsonify({"message": "Cart cleared"})