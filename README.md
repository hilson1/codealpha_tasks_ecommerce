# codealpha_tasks_ecommerce

# required package
flask
flask-pymongo
pymongo
python-dotenv
bcrypt
PyJWT
flask-cors

# folder structure
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js
    │   ├── auth.js
    │   ├── cart.js
    │   └── products.js
    ├── index.html
    ├── product.html
    ├── cart.html
    ├── orders.html
    ├── login.html
    └── register.html
