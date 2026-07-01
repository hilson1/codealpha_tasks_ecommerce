async function loadOrders() {
  const container = document.getElementById("orders-list");

  container.innerHTML = "<h3>Loading...</h3>";

  try {
    const orders = await api.get("/orders");

    if (!orders.length) {
      container.innerHTML = `
                <div class="empty-orders">
                    <h2>No Orders Found</h2>
                    <a href="products.html" class="shop-btn">
                        Continue Shopping
                    </a>
                </div>
            `;

      return;
    }

    container.innerHTML = "";

    orders.forEach((order) => {
      const items = order.items
        .map(
          (item) => `

                <div class="order-item">

                    <div>
                        <h4>${item.name}</h4>

                        <p>₹${item.price}</p>

                        <small>Quantity : ${item.quantity}</small>
                    </div>

                    <strong>
                        ₹${item.price * item.quantity}
                    </strong>

                </div>

            `,
        )
        .join("");

      container.innerHTML += `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h3>Order #${order._id.slice(-6)}</h3>

                            <small>
                                ${new Date(order.createdAt).toLocaleString()}
                            </small>

                        </div>

                        <span class="status">

                            ${order.status}

                        </span>

                    </div>

                    ${items}

                    <div class="shipping">

                        <h4>Shipping Address</h4>

                        <p>

                        ${order.shippingAddress.street}<br>

                        ${order.shippingAddress.city}<br>

                        ${order.shippingAddress.zip}<br>

                        ${order.shippingAddress.country}

                        </p>

                    </div>

                    <div class="order-footer">

                        <h2>Total ₹${order.totalAmount}</h2>

                    </div>

                </div>

            `;
    });
  } catch (err) {
    console.error(err);

    container.innerHTML = `
            <h2>${err.message}</h2>
        `;
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
