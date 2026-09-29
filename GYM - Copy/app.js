// CKO Kickboxing Common Utility Scripts

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
      if (menuIcon) menuIcon.classList.toggle("hidden");
      if (closeIcon) closeIcon.classList.toggle("hidden");
    });
  }

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll, .mobile-scale-in").forEach((el) => {
    observer.observe(el);
  });
});

// Redirect/Scroll to ZIP Input search helper
function redirectToHeroZip() {
  const zipInput = document.getElementById("zip-input");
  if (zipInput) {
    zipInput.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    setTimeout(() => {
      zipInput.focus();
      zipInput.classList.add("ring-2", "ring-[#fec400]");
      setTimeout(() => {
        zipInput.classList.remove("ring-2", "ring-[#fec400]");
      }, 1000);
    }, 600);
  } else {
    // If not on homepage, redirect to home with hash to focus
    window.location.href = "index.html#search-studio";
  }
}

// On page load check for hash to focus search
window.addEventListener("load", () => {
  if (window.location.hash === "#search-studio") {
    setTimeout(redirectToHeroZip, 300);
  }
});
