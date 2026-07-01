let allProducts = [];

const renderProducts = (products) => {
  const grid = document.getElementById("products-grid");

  if (!products.length) {
    grid.innerHTML = `<p class="empty">No products found.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
      <div class="card" onclick="location.href='product.html?id=${p._id}'">
        <img src="${p.image}" alt="${p.name}">

        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="price">₹${p.price.toLocaleString()}</p>
          <p class="category">${p.category}</p>

          <button class="btn" onclick="addToCart(event,'${p._id}')">
            Add to Cart
          </button>
        </div>
      </div>
    `,
    )
    .join("");
};

async function loadProducts() {
  try {
    allProducts = await api.get("/products");
    renderProducts(allProducts);
    updateCartCount();
  } catch (err) {
    console.error(err);
  }
}

async function addToCart(e, productId) {
  e.stopPropagation();

  if (!getToken()) {
    location.href = "login.html";
    return;
  }

  try {
    await api.post("/cart/add", {
      productId: productId,
      quantity: 1,
    });

    updateCartCount();
    alert("Product added to cart");
  } catch (err) {
    alert(err.message);
  }
}

const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    renderProducts(
      allProducts.filter((p) => p.name.toLowerCase().includes(keyword)),
    );
  });
}

const category = document.getElementById("category");
if (category) {
  category.addEventListener("change", (e) => {
    const value = e.target.value;
    if (!value) {
      renderProducts(allProducts);
      return;
    }
    renderProducts(allProducts.filter((p) => p.category === value));
  });
}

loadProducts();
