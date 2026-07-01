const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    alert("Login successful!");

    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
});
