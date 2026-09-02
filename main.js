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
const contactForm = document.querySelector('.contact-form');

function isFormConfigured() {
  const endpoint = window.CONTACT_FORM?.endpoint;
  return Boolean(endpoint && !endpoint.includes('YOUR_FORM_ID'));
}

function setFieldError(field, hasError) {
  field.style.borderColor = hasError ? 'rgba(220, 60, 60, 0.7)' : '';
}

function showFormError(message) {
  const errorMsg = document.getElementById('form-error');
  if (!errorMsg) return;
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function hideFormError() {
  const errorMsg = document.getElementById('form-error');
  if (errorMsg) errorMsg.hidden = true;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.btn-submit');
  const successMsg = document.getElementById('form-success');
  hideFormError();

  const requiredFields = form.querySelectorAll('input[required], textarea[required]');
  let valid = true;
  requiredFields.forEach(field => {
    const empty = !field.value.trim();
    if (empty) valid = false;
    setFieldError(field, empty);
  });

  const emailField = form.querySelector('input[type="email"]');
  if (emailField && emailField.value.trim() && !emailField.checkValidity()) {
    valid = false;
    setFieldError(emailField, true);
  }

  if (!valid) {
    showFormError(window.getI18n?.('contact.form.error_required') || 'Please fill in all required fields.');
    return;
  }

  if (!isFormConfigured()) {
    showFormError(window.getI18n?.('contact.form.error_not_configured') || 'The contact form is not configured yet.');
    return;
  }

  const honeypot = form.querySelector('input[name="_gotcha"]');
  if (honeypot?.value) return;

  const defaultLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = window.getI18n?.('contact.form.sending') || 'Sending…';

  try {
    const response = await fetch(window.CONTACT_FORM.endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const fieldError = data.errors?.[0]?.message;
      throw new Error(fieldError || data.error || 'Request failed');
    }

    form.reset();
    form.hidden = true;
    successMsg.hidden = false;
  } catch (err) {
    const fallback = window.getI18n?.('contact.form.error_send') || 'Something went wrong. Please try again or email us directly.';
    showFormError(err.message && err.message !== 'Request failed' ? err.message : fallback);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = defaultLabel;
  }
}

if (contactForm) {
  if (isFormConfigured()) {
    contactForm.action = window.CONTACT_FORM.endpoint;
    contactForm.method = 'POST';
  }
  contactForm.addEventListener('submit', handleFormSubmit);
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
