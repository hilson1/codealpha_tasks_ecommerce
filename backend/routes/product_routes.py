from flask import Blueprint, request, jsonify
from config.db import mongo
from bson import ObjectId

product_bp = Blueprint("products", __name__)

def serialize(p):
    p["_id"] = str(p["_id"])
    return p


@product_bp.route("/", methods=["GET"], strict_slashes=False)
def get_products():
    search = request.args.get("search", "")
    category = request.args.get("category", "")

    query = {}

    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    if category:
        query["category"] = category

    products = [serialize(p) for p in mongo.db.products.find(query)]
    return jsonify(products)


@product_bp.route("/<product_id>", methods=["GET"], strict_slashes=False)
def get_product(product_id):
    try:
        product = mongo.db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"message": "Product not found"}), 404
        return jsonify(serialize(product))
    except Exception:
        return jsonify({"message": "Invalid product ID"}), 400


@product_bp.route("/seed", methods=["POST"], strict_slashes=False)
def seed_products():
    mongo.db.products.delete_many({})

    products = [
        {
            "name": "Wireless Headphones",
            "description": "Premium audio, 30hr battery",
            "price": 2999,
            "image": "https://placehold.co/300x300?text=Headphones",
            "category": "Electronics",
            "stock": 20
        },
        {
            "name": "Running Shoes",
            "description": "Lightweight & breathable",
            "price": 4500,
            "image": "https://placehold.co/300x300?text=Shoes",
            "category": "Sports",
            "stock": 15
        },
        {
            "name": "Coffee Maker",
            "description": "Brews perfect espresso",
            "price": 3200,
            "image": "https://placehold.co/300x300?text=Coffee",
            "category": "Kitchen",
            "stock": 8
        },
        {
            "name": "Laptop Stand",
            "description": "Ergonomic aluminium, adjustable",
            "price": 1800,
            "image": "https://placehold.co/300x300?text=Stand",
            "category": "Electronics",
            "stock": 30
        },
        {
            "name": "Water Bottle",
            "description": "Insulated 1L, keeps cold 24hr",
            "price": 850,
            "image": "https://placehold.co/300x300?text=Bottle",
            "category": "Sports",
            "stock": 50
        },
        {
            "name": "Desk Lamp",
            "description": "LED, 3 brightness levels",
            "price": 1200,
            "image": "https://placehold.co/300x300?text=Lamp",
            "category": "Home",
            "stock": 25
        }
    ]

    mongo.db.products.insert_many(products)

    return jsonify({
        "message": f"{len(products)} products seeded successfully"
    }), 201