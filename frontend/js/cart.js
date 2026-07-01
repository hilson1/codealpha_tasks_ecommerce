async function loadCart() {
  const container = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");
  const checkout = document.getElementById("checkout-form");

  try {
    const cart = await api.get("/cart");

    container.innerHTML = "";

    if (!cart.length) {
      container.innerHTML = `
        <div class="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png">
          <h3>Your Cart is Empty</h3>
          <p>Add products to continue shopping.</p>

          <a href="products.html" class="shop-btn">
            Continue Shopping
          </a>
        </div>
      `;

      totalBox.innerHTML = "";
      checkout.style.display = "none";
      updateCartCount();
      return;
    }

    checkout.style.display = "block";

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      container.innerHTML += `
        <div class="cart-item"
             style="animation-delay:${index * 0.08}s">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-details">

                <h3>${item.name}</h3>

                <p>Premium Product</p>

                <div class="price">
                    ₹${item.price.toLocaleString()}
                </div>

            </div>

            <div class="quantity">

                <button onclick="changeQty('${item.productId}',${item.quantity - 1})">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQty('${item.productId}',${item.quantity + 1})">
                    +
                </button>

            </div>

            <button class="remove-btn"
                onclick="removeItem('${item.productId}')">
                Remove
            </button>

        </div>
      `;
    });

    totalBox.innerHTML = `
        <h2>Total : ₹${total.toLocaleString()}</h2>
    `;

    updateCartCount();
  } catch (err) {
    alert(err.message);
  }
}

async function changeQty(productId, quantity) {
  if (quantity <= 0) {
    removeItem(productId);
    return;
  }

  try {
    await api.put("/cart/" + productId, {
      quantity,
    });

    loadCart();
  } catch (err) {
    alert(err.message);
  }
}

async function removeItem(productId) {
  if (!confirm("Remove this item from cart?")) return;

  try {
    await api.del("/cart/" + productId);

    loadCart();
  } catch (err) {
    alert(err.message);
  }
}

async function placeOrder() {
  const street = document.getElementById("street").value.trim();
  const city = document.getElementById("city").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!street || !city || !zip || !country) {
    alert("Please fill all shipping details.");
    return;
  }

  try {
    const btn = document.querySelector(".checkout-btn");

    btn.disabled = true;
    btn.innerHTML = "Placing Order...";

    await api.post("/orders", {
      shippingAddress: {
        street,
        city,
        zip,
        country,
      },
    });

    alert("Order placed successfully!");

    updateCartCount();

    location.href = "orders.html";
  } catch (err) {
    alert(err.message);
  }
}

window.changeQty = changeQty;
window.removeItem = removeItem;
window.placeOrder = placeOrder;

document.addEventListener("DOMContentLoaded", loadCart);
