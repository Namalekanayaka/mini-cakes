// =============================
// Header scroll effect
// =============================
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// =============================
// Cake variant selector
// =============================
const mainCake = document.getElementById("mainCake");
const variantItems = document.querySelectorAll(".variant-item");

// Set default cake
if (mainCake) {
  mainCake.textContent = "🧁";
}

variantItems.forEach((item) => {
  item.addEventListener("click", () => {
    const cake = item.dataset.cake;
    mainCake.textContent = cake;

    // Highlight selected cake
    variantItems.forEach((v) => v.classList.remove("active"));
    item.classList.add("active");
  });
});

// =============================
// Scroll reveal animation
// =============================
const faders = document.querySelectorAll(".fade-in-up");

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// =============================
// Form validation & submission
// =============================
const form = document.getElementById("signup-form");
const messageDiv = document.getElementById("message");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();

    // Reset message
    messageDiv.style.display = "none";
    messageDiv.className = "message";

    // Validate first name
    if (firstName.length < 2) {
      showMessage(
        "⚠️ Please enter a valid first name (at least 2 letters).",
        "error"
      );
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      showMessage("⚠️ Please enter a valid email address.", "error");
      return;
    }

    // Simulated success message (replace with backend/API later)
    showMessage(
      `🎉 Thank you ${firstName}! Your free Mini-Cakes e-book will be sent to ${email}.`,
      "success"
    );

    form.reset();
  });
}

// =============================
// Helpers
// =============================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.style.display = "block";
  messageDiv.classList.add(type);
}
