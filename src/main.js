// Origin Talent — homepage behavior: pattern-rack scroll-spy, reveal-on-scroll,
// mobile rack toggle, form-tab switching, category-to-form handoff,
// consent-gated sensitive fields, and form submission to the Google Sheets bridge.

const FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzmlB0CgTQqSbQ-m-RH7HnQiO0xAhpQAGYC66JZlxxNf1mYhKYCaHr2vGDJn1ZugXvQDA/exec';

// ---------- candidate consent gate: sensitive fields stay disabled until both boxes are checked ----------
const sensitiveGroup = document.getElementById('candidate-sensitive-group');
const popiaCheck = document.getElementById('a-popia');
const screeningCheck = document.getElementById('a-screening');
if (sensitiveGroup && popiaCheck && screeningCheck) {
  const syncGate = () => {
    sensitiveGroup.disabled = !(popiaCheck.checked && screeningCheck.checked);
  };
  popiaCheck.addEventListener('change', syncGate);
  screeningCheck.addEventListener('change', syncGate);
  syncGate();
}

// ---------- mobile rack toggle ----------
const rack = document.querySelector('.rack');
const navToggle = document.querySelector('.masthead__nav-toggle');
if (navToggle && rack) {
  navToggle.addEventListener('click', () => {
    const isOpen = rack.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// ---------- scroll-spy: highlight the active pattern tab ----------
const tabs = Array.from(document.querySelectorAll('.rack__tab'));
const sections = tabs
  .map((tab) => document.getElementById(tab.getAttribute('href').slice(1)))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        tabs.forEach((tab) => {
          tab.classList.toggle('is-active', tab.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));
}

// close mobile rack after choosing a category
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    if (rack && rack.classList.contains('is-open')) {
      rack.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---------- reveal-on-scroll: pattern pieces settle into place, once ----------
const revealTargets = document.querySelectorAll('.category');
if ('IntersectionObserver' in window && revealTargets.length) {
  const reveal = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => reveal.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// ---------- form tabs (client / candidate) ----------
const formTabs = Array.from(document.querySelectorAll('.form-tab'));
const formPanels = document.querySelectorAll('.form-panel');

function activateFormTab(targetId) {
  formTabs.forEach((t) => {
    const isActive = t.dataset.target === targetId;
    t.classList.toggle('is-active', isActive);
    t.setAttribute('aria-selected', String(isActive));
    t.setAttribute('tabindex', isActive ? '0' : '-1');
  });
  formPanels.forEach((p) => p.classList.toggle('is-active', p.id === targetId));
}

formTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateFormTab(tab.dataset.target);
    document.getElementById(tab.dataset.target)?.scrollIntoView({ block: 'nearest' });
  });
});

// ---------- category "Enquire about X" links pre-select the role + switch tab ----------
document.querySelectorAll('.category__link').forEach((link) => {
  link.addEventListener('click', () => {
    const categoryName = link.closest('.category')?.querySelector('.category__name')?.textContent.trim();
    if (!categoryName) return;
    activateFormTab('enquire');
    const roleSelect = document.getElementById('c-role');
    if (roleSelect) {
      const shortName = categoryName.split(' (')[0];
      const match = Array.from(roleSelect.options)
        .filter((opt) => opt.value !== '')
        .find((opt) => categoryName.startsWith(opt.value) || opt.value.startsWith(shortName));
      if (match) roleSelect.value = match.value;
    }
  });
});

// ---------- service-page handoff: ?role=X pre-selects the enquiry role ----------
const roleParam = new URLSearchParams(window.location.search).get('role');
if (roleParam) {
  const roleSelect = document.getElementById('c-role');
  if (roleSelect) {
    const match = Array.from(roleSelect.options).find((opt) => opt.value === roleParam);
    if (match) {
      activateFormTab('enquire');
      roleSelect.value = match.value;
    }
  }
}

// ---------- form submission ----------
function wireForm(formEl, formType) {
  if (!formEl) return;
  const statusEl = formEl.querySelector('.form-status');
  const submitBtn = formEl.querySelector('button[type="submit"]');

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!formEl.reportValidity()) return;

    const data = { formType };
    new FormData(formEl).forEach((value, key) => {
      if (data[key] !== undefined) {
        data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      } else {
        data[key] = value;
      }
    });
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) data[key] = data[key].join(', ');
    });

    const contactMethod = data['Preferred Contact Method'];
    const successMessage = contactMethod
      ? `Received — thank you. We'll be in touch by ${contactMethod.toLowerCase()} within 1–2 business days.`
      : "Received — thank you. We'll be in touch within 1–2 business days.";

    submitBtn.disabled = true;
    statusEl.textContent = 'Sending…';
    statusEl.dataset.state = 'pending';

    try {
      const response = await fetch(FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result && result.status === 'ok') {
        statusEl.textContent = successMessage;
        statusEl.dataset.state = 'success';
        formEl.reset();
        if (formEl.id === 'candidate-form') activateFormTab('apply');
      } else {
        throw new Error((result && result.message) || 'Unexpected response');
      }
    } catch (err) {
      statusEl.textContent = "That didn't go through — please try again, or reach us directly by phone or WhatsApp.";
      statusEl.dataset.state = 'error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

wireForm(document.getElementById('client-form'), 'client');
wireForm(document.getElementById('candidate-form'), 'candidate');
