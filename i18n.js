const SUPPORTED_LANGS = ['en', 'bg'];
const DEFAULT_LANG = 'en';

const cache = {};
let currentLang = DEFAULT_LANG;

// Resolve a dot-path key like "hero.title" against a translations object
function resolve(obj, key) {
  return key.split('.').reduce((o, k) => o?.[k], obj);
}

async function fetchTranslations(lang) {
  if (cache[lang]) return cache[lang];
  const res = await fetch(`translations/${lang}.json`);
  if (!res.ok) throw new Error(`Could not load translations/${lang}.json`);
  cache[lang] = await res.json();
  return cache[lang];
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = resolve(t, el.dataset.i18n);
    if (val != null) el.textContent = val;
  });
}

function getLangFromURL() {
  const p = new URLSearchParams(window.location.search).get('lang');
  return SUPPORTED_LANGS.includes(p) ? p : null;
}

function updateURL(lang) {
  const url = new URL(window.location);
  if (lang === DEFAULT_LANG) {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', lang);
  }
  history.pushState({}, '', url);
}

function updateSwitcher(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-current', active ? 'true' : 'false');
  });
}

async function setLanguage(lang, pushURL = true) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const t = await fetchTranslations(lang);
  currentLang = lang;
  localStorage.setItem('preferredLang', lang);
  if (pushURL) updateURL(lang);
  applyTranslations(t);
  document.documentElement.lang = lang;
  updateSwitcher(lang);
}

async function initI18n() {
  const lang = getLangFromURL()
    || localStorage.getItem('preferredLang')
    || DEFAULT_LANG;

  // Prefetch both so switching is instant
  fetchTranslations('en');
  fetchTranslations('bg');

  await setLanguage(lang, false);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
}

initI18n();
