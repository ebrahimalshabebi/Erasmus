document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  const setNavState = (isOpen) => {
    if (!toggleBtn || !nav) {
      return;
    }

    nav.classList.toggle("is-open", isOpen);
    toggleBtn.classList.toggle("is-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      setNavState(!nav.classList.contains("is-open"));
    });

    // Optional: close menu when clicking a link (mobile)
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          setNavState(false);
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720 && nav.classList.contains("is-open")) {
        setNavState(false);
      }
    });
  }

});
