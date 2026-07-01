async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html");
    if (!response.ok) throw new Error("Navbar not found");

    const html = await response.text();
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    navbar.innerHTML = html;

    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    // Hamburger toggle
    if (menuBtn && navMenu) {
      menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("show");
        menuBtn.classList.toggle("active");
      });
    }

    // Close mobile menu when a link is clicked
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("show");
        menuBtn.classList.remove("active");
      });
    });

    // Highlight active page
    const current = location.pathname.split("/").pop() || "index.html";
    navMenu.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });

    // Auth state
    const authLink = document.getElementById("auth-link");
    const user = JSON.parse(localStorage.getItem("user"));

    if (authLink) {
      if (user) {
        authLink.innerHTML = `
          <span class="user-name">Hi, ${user.name}</span>
          <a href="#" id="logout" class="logout-btn">Logout</a>
        `;
        document.getElementById("logout").addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          location.href = "login.html";
        });
      } else {
        authLink.innerHTML = `
          <a href="login.html" class="login-link">Login</a>
          <a href="register.html" class="register-btn">Register</a>
        `;
      }
    }

    updateCartBadge();
  } catch (err) {
    console.error(err);
  }
}

async function updateCartBadge() {
  const token = localStorage.getItem("token");
  const badge = document.getElementById("cart-count");
  if (!token || !badge) return;

  try {
    const res = await fetch("http://localhost:5000/api/cart/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const cart = await res.json();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  } catch {
    /* fail silently */
  }
}

loadNavbar();
