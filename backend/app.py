from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

from config.db import mongo

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET")

    CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True,
    )
    mongo.init_app(app)

    # Register blueprints
    from routes.auth_routes    import auth_bp
    from routes.product_routes import product_bp
    from routes.cart_routes    import cart_bp
    from routes.order_routes   import order_bp

    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(cart_bp,    url_prefix="/api/cart")
    app.register_blueprint(order_bp,   url_prefix="/api/orders")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))