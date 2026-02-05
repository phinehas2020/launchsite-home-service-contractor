document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealElements = document.querySelectorAll(".reveal-on-scroll");
const counters = document.querySelectorAll("[data-counter]");
const currentYear = document.querySelector("[data-current-year]");
const form = document.querySelector("[data-contact-form]");
const feedback = document.querySelector("[data-form-feedback]");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function setHeaderState() {
  if (!header) return;

  if (window.scrollY > 28) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

function toggleMenu() {
  if (!menuToggle || !nav) return;

  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
}

function closeMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}

function animateCounter(element) {
  if (!element || element.dataset.animated === "true") return;

  const target = Number(element.dataset.counter || "0");
  const suffix = element.dataset.suffix || "";
  element.dataset.animated = "true";

  if (!Number.isFinite(target) || prefersReducedMotion) {
    element.textContent = `${target.toLocaleString()}${suffix}`;
    return;
  }

  let startValue = 0;
  const duration = 900;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(startValue + (target - startValue) * eased);
    element.textContent = `${value.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!form || !feedback) return;

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const details = String(formData.get("details") || "").trim();

  if (!name || !phone || !email || !service || !details) {
    feedback.textContent =
      "Please complete every field so dispatch can route your request correctly.";
    feedback.classList.add("is-error");
    feedback.classList.remove("is-success");
    return;
  }

  feedback.textContent =
    "Request received. A coordinator will contact you shortly to confirm next steps.";
  feedback.classList.add("is-success");
  feedback.classList.remove("is-error");
  form.reset();
}

if (window.lucide) {
  window.lucide.createIcons();
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (nav) {
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        if (entry.target.matches("[data-counter]")) {
          animateCounter(entry.target);
        }

        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
  counters.forEach((counter) => observer.observe(counter));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  counters.forEach((counter) => animateCounter(counter));
}

if (form) {
  form.addEventListener("submit", handleFormSubmit);
}
