// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Cake variant switching
const mainCake = document.getElementById("mainCake");
const variants = document.querySelectorAll(".variant-item");

variants.forEach((variant) => {
  variant.addEventListener("click", function () {
    const cakeEmoji = this.dataset.cake;
    mainCake.style.setProperty("--cake-emoji", `"${cakeEmoji}"`);

    // Remove active class from all variants
    variants.forEach((v) => (v.style.background = ""));
    // Add active state to clicked variant
    this.style.background = "var(--gold)";

    // Animate main cake
    mainCake.style.transform = "scale(0.9)";
    setTimeout(() => {
      mainCake.style.transform = "scale(1)";
    }, 150);
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in-up").forEach((el) => {
  observer.observe(el);
});

// Form handling with enhanced security
const form = document.getElementById("signup-form");
const messageDiv = document.getElementById("message");
const submitBtn = form.querySelector(".submit-btn");
const firstNameInput = document.getElementById("firstName");
const emailInput = document.getElementById("email");

// Input sanitization function
function sanitizeInput(input) {
  return input.replace(/[<>\"'&]/g, "").trim();
}

// Enhanced email validation function
function isValidEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
}

// Enhanced name validation function
function isValidName(name) {
  const nameRegex = /^[A-Za-z\s\u00C0-\u017F]{2,50}$/;
  return nameRegex.test(name) && name.length >= 2;
}

// Profanity and suspicious content filter
function containsInappropriateContent(text) {
  const suspiciousPatterns = [
    /[<>]/,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<script/i,
    /<iframe/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(text));
}

// Show message function with auto-hide
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";
  messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Auto hide after 8 seconds
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 8000);
}

// Real-time validation with security checks
firstNameInput.addEventListener("input", function () {
  let name = sanitizeInput(this.value);

  if (containsInappropriateContent(name)) {
    this.setCustomValidity("Invalid characters detected");
    this.value = name.replace(/[<>]/g, "");
    return;
  }

  if (name && !isValidName(name)) {
    this.setCustomValidity("Please enter a valid name (2-50 letters only)");
  } else {
    this.setCustomValidity("");
  }
});

emailInput.addEventListener("input", function () {
  let email = sanitizeInput(this.value);

  if (containsInappropriateContent(email)) {
    this.setCustomValidity("Invalid characters detected");
    this.value = email.replace(/[<>]/g, "");
    return;
  }

  if (email && !isValidEmail(email)) {
    this.setCustomValidity("Please enter a valid email address");
  } else {
    this.setCustomValidity("");
  }
});

// Rate limiting for form submissions
let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN = 5000; // 5 seconds

// Enhanced form submission with security measures
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Rate limiting check
  const currentTime = Date.now();
  if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
    showMessage("Please wait before submitting again.", "error");
    return;
  }

  // Get and sanitize form data
  const firstName = sanitizeInput(firstNameInput.value);
  const email = sanitizeInput(emailInput.value);

  // Enhanced validation checks
  if (!firstName || !email) {
    showMessage("Please fill in all required fields.", "error");
    return;
  }

  if (
    containsInappropriateContent(firstName) ||
    containsInappropriateContent(email)
  ) {
    showMessage(
      "Invalid characters detected. Please check your input.",
      "error"
    );
    return;
  }

  if (!isValidName(firstName)) {
    showMessage(
      "Please enter a valid first name (2-50 letters only).",
      "error"
    );
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  // Additional security: Check for duplicate rapid submissions
  const formData = `${firstName}:${email}`;
  const formHash = btoa(formData);
  const lastFormHash = sessionStorage.getItem("lastFormHash");

  if (lastFormHash === formHash && currentTime - lastSubmissionTime < 30000) {
    showMessage("This information was already submitted recently.", "error");
    return;
  }

  // Show loading state
  form.classList.add("loading");
  submitBtn.textContent = "Processing...";
  submitBtn.disabled = true;

  try {
    // Update rate limiting
    lastSubmissionTime = currentTime;
    sessionStorage.setItem("lastFormHash", formHash);

    // Simulate API call delay (replace with actual Mailchimp integration)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would integrate with Mailchimp API
    // Example Mailchimp integration:
    /*
        const response = await fetch('/api/mailchimp-subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                email: email
            })
        });
        
        if (!response.ok) {
            throw new Error('Subscription failed');
        }
        */

    // Success simulation
    showMessage(
      "🎉 Success! Check your email for the download link to your free Mini-Cakes e-book.",
      "success"
    );
    form.reset();

    // Clear form validation states
    firstNameInput.setCustomValidity("");
    emailInput.setCustomValidity("");
  } catch (error) {
    console.error("Subscription error:", error);
    showMessage(
      "Sorry, there was an error processing your request. Please try again.",
      "error"
    );
  } finally {
    // Remove loading state
    form.classList.remove("loading");
    submitBtn.textContent = "Download Your Free E-book";
    submitBtn.disabled = false;
  }
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Security: Prevent form resubmission on page refresh
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Additional security: Clear sensitive data on page unload
window.addEventListener("beforeunload", function () {
  sessionStorage.removeItem("lastFormHash");
});

// Keyboard navigation enhancement
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.tagName === "A") {
    e.target.click();
  }
});

// Focus management for accessibility
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modal = document.querySelector(".form-section");

// Enhanced input validation on paste events
firstNameInput.addEventListener("paste", function (e) {
  setTimeout(() => {
    this.value = sanitizeInput(this.value);
    if (containsInappropriateContent(this.value)) {
      this.value = this.value.replace(/[<>]/g, "");
      showMessage(
        "Pasted content contained invalid characters and was cleaned.",
        "error"
      );
    }
  }, 10);
});

emailInput.addEventListener("paste", function (e) {
  setTimeout(() => {
    this.value = sanitizeInput(this.value);
    if (containsInappropriateContent(this.value)) {
      this.value = this.value.replace(/[<>]/g, "");
      showMessage(
        "Pasted content contained invalid characters and was cleaned.",
        "error"
      );
    }
  }, 10);
});

// Console security warning
console.warn(
  "%c🛡️ SECURITY WARNING",
  "color: red; font-size: 20px; font-weight: bold;"
);
console.warn(
  "%cThis is a browser feature intended for developers. Do not paste or type any code here that you do not understand. This could allow attackers to impersonate you and steal your information.",
  "color: red; font-size: 14px;"
);

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Set initial cake variant
  const firstVariant = document.querySelector(".variant-item");
  if (firstVariant) {
    firstVariant.click();
  }

  // Add loading complete class for animations
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});
