// ── Navigation ────────────────────────────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open', !expanded);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ── Contact Form ──────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const successMsg = document.getElementById('form-success');

  // Simple validation
  const requiredFields = form.querySelectorAll('input[required], textarea[required]');
  let valid = true;
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = 'rgba(220, 60, 60, 0.7)';
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) return;

  // Show success
  form.style.display = 'none';
  successMsg.hidden = false;
}

// ── Scroll Animations ─────────────────────────────────────
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card, .ops-item, .process-step, .section-header').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}
