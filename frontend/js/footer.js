async function loadFooter() {
  try {
    const response = await fetch("components/footer.html");
    if (!response.ok) throw new Error("Footer not found");

    const html = await response.text();

    const footer = document.getElementById("footer");
    if (footer) footer.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

loadFooter();
