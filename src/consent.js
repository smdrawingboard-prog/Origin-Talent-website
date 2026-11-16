/* ============================================================
   Origin Talent — cookie & browser-storage consent (POPIA)
   Added 2026-10-30.

   How it works
   - Essential storage (this consent record, the one-per-visit splash flag)
     is always on: the site needs it to work and to remember your choice.
   - Anything optional (currently only "analytics", which is NOT in use yet)
     stays off until the visitor actively allows it. No pre-ticked boxes,
     no "by continuing you agree".
   - Refusing is one click and carries the same weight as allowing.
   - The choice is kept for 12 months, or until CONSENT_VERSION changes,
     then the visitor is asked again. "Cookie settings" in the footer
     reopens the banner at any time so consent can be withdrawn.

   Adding analytics later (e.g. GA4)
   Do NOT paste the vendor tag into the HTML. Load it from here instead:

     OTConsent.onChange(function (c) {
       if (c.analytics) { ...inject the analytics <script> here... }
     });

   Then update the cookie table in privacy.html#cookies, and bump
   CONSENT_VERSION so everyone is asked again with the new information.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'ot-consent';
  var CONSENT_VERSION = 1;
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

  var memoryRecord = null; // fallback when localStorage is blocked
  var listeners = [];

  function read() {
    var rec = memoryRecord;
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) rec = JSON.parse(raw);
    } catch (e) { /* storage blocked: fall back to memory */ }
    if (!rec || rec.v !== CONSENT_VERSION) return null;
    if (!rec.ts || Date.now() - Date.parse(rec.ts) > MAX_AGE_MS) return null;
    return rec;
  }

  function write(analytics) {
    var rec = { v: CONSENT_VERSION, analytics: !!analytics, ts: new Date().toISOString() };
    memoryRecord = rec;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rec)); } catch (e) { /* ignore */ }
    listeners.forEach(function (fn) { try { fn(rec); } catch (e) { /* ignore */ } });
    try { document.dispatchEvent(new CustomEvent('ot:consent', { detail: rec })); } catch (e) { /* ignore */ }
    return rec;
  }

  var banner, lastFocus;

  function build() {
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.id = 'consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie and privacy choices');
    banner.hidden = true;
    banner.innerHTML =
      '<div class="consent__inner">' +
        '<div>' +
          '<p class="consent__title" id="consent-title">Your privacy</p>' +
          '<p class="consent__text">We use only essential browser storage to make this site work and to remember this choice. ' +
          'We don’t use advertising or tracking cookies. Analytics stays off unless you allow it, and you can change your mind at any time. ' +
          '<a href="privacy.html#cookies">Read our cookie notice</a>.</p>' +
        '</div>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn-outline consent__btn" data-consent="essential">Essential only</button>' +
          '<button type="button" class="btn btn-outline consent__btn" data-consent="all">Allow analytics</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      write(btn.getAttribute('data-consent') === 'all');
      hide();
    });
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && read()) hide();
    });
  }

  function show(focus) {
    if (!banner) build();
    lastFocus = document.activeElement;
    banner.hidden = false;
    if (focus) {
      var first = banner.querySelector('[data-consent]');
      if (first) first.focus();
    }
  }

  function hide() {
    banner.hidden = true;
    if (lastFocus && typeof lastFocus.focus === 'function' && lastFocus !== document.body) lastFocus.focus();
  }

  window.OTConsent = {
    get: read,
    has: function (category) {
      var rec = read();
      return !!(rec && rec[category]);
    },
    onChange: function (fn) {
      listeners.push(fn);
      var rec = read();
      if (rec) fn(rec);
    },
    open: function () { show(true); }
  };

  function init() {
    build();
    if (!read()) show(false);
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-open-consent]');
      if (!t) return;
      e.preventDefault();
      show(true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
