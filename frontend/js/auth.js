const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const updateCartCount = async () => {
  if (!getToken()) return;
  try {
    const cart = await api.get("/cart");
    const el = document.getElementById("cart-count");
    if (el) el.textContent = cart.reduce((s, i) => s + i.quantity, 0);
  } catch {}
};

// Render auth link in navbar
const authLink = document.getElementById("auth-link");
if (authLink) {
  const user = getUser();
  authLink.innerHTML = user
    ? `<span>Hi, ${user.name}</span> <a href="#" onclick="logout()">Logout</a>`
    : `<a href="login.html">Login</a>`;
}

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.href = "login.html";
};
