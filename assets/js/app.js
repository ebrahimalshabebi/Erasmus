const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

toggleBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggleBtn.setAttribute("aria-expanded", String(isOpen));
});

// Optional: close menu when clicking a link (mobile)
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
});
