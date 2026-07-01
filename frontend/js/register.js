const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    alert("Registration successful!");

    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
});
