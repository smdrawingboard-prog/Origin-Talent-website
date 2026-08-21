# Design

<!-- impeccable:design-schema 1 -->

## World

**The Tailor's Pattern Book.** Origin Talent measures a household once, precisely, and keeps a pattern book of the professionals fitted to it. Built from a bespoke-tailoring/pattern-drafting register (chosen via the direction round, seed key `5886571f`, assigned index 3), then re-rendered in the user's pinned real brand identity once it surfaced mid-build: grayscale-only, Century Gothic.

## Colors — pinned by the user, not invented

- `#f0f0f0` — paper / page background
- `#474747`, `#444444` — ink (two closely-related dark grays; `#444444` used as primary body/heading ink, `#474747` as secondary/soft)
- `#ffffff` — white surfaces (cards, form fields)
- `#1c1c1c` (`--ink-strong`) — an internal extension of the same neutral family for maximum-contrast elements (primary button fill, active states); not a new hue, just a darker value within the pinned grayscale.
- No color accent anywhere. Interactive/active state is conveyed by weight, underline, fill-inversion, and a small dot/tab indicator — never by color change.

## Typography

- Display and body: **Century Gothic** (the real logo's typeface, confirmed by the user), with **Jost** (self-hosted via Google Fonts) as the free-web fallback for visitors without Century Gothic installed. This is the "closest obtainable face" concession — Century Gothic itself is not licensable as a web font.
- Scale: hero `clamp(2.4rem, 5.4vw, 4.1rem)`, section titles `clamp(1.6rem, 3vw, 2.1rem)`, category names `1.65rem`, body `17px` base / `1.6` line-height, small caps labels `0.7–0.78rem` at `0.14–0.18em` tracking.

## Materials & motifs

- **Chalk snap-line rule** (`.snapline`): a 1px dashed horizontal rule (repeating-gradient technique) used sparingly as a section divider — literal reference to a tailor's chalk snap-line / tracing-wheel perforation. Not a decorative background grid; suppressed once in the design-hook with that reasoning (`.impeccable/config.json` detector.ignoreValues).
- **Pattern rack** (`.rack`): sticky left-hand category navigation, ten tabs, each with a small circular "pin" marker that fills solid when active (scroll-spy driven).
- **Pattern-piece cards** (`.category`): photo + copy pairs that settle into place on scroll (translateY + slight rotate, IntersectionObserver-triggered once, `cubic-bezier(0.16,1,0.3,1)` ease).
- Photography rendered `grayscale(1) contrast(1.03)` to stay inside the pinned palette regardless of source color.
- Hairline borders (`#d4d4d4` / `#e2e2e2`) delimit grid cells (checklist, downloads, photo strip) instead of shadows or color fills.

## Components

- **Masthead**: sticky, logo left (real SVG), contact right (collapses to a hamburger + drawer rack under 900px).
- **Buttons**: `.btn-primary` — filled `--ink-strong`, 1px border, no radius; `.link-cta` — underlined text link. No secondary/ghost button variant needed yet.
- **Forms**: each form is split into labeled `<fieldset class="field-group">` sections (small-caps title matching the site's other section labels), not one flat field wall — Client: Your Details / The Role / Consent; Candidate: Before You Start (POPIA + screening consent) / Your Details / The Role / Declaration. Consent is deliberately the *first* group on the Candidate form, ahead of ID Number/DOB/Next of Kin, so applicants see the data-use terms before typing sensitive information. Two-column field grid within each group (collapses to one column under 640px), underline-emphasis focus state, native `<select>` with a custom SVG chevron. Every non-required field label carries a visible `(optional)` qualifier for scannability (`.opt`), not just the required `*`. Mobile/Alt Phone/Next of Kin Number carry `inputmode="tel"` + `pattern="^[0-9+\(\)\- ]{7,15}$"` (parens/hyphen escaped for browsers' stricter v-mode character-class parsing — an unescaped version throws a console SyntaxError on every validation, caught in the second critique pass); ID Number carries `inputmode="numeric" pattern="\d{13}"`.
- **Progressive disclosure within field groups**: the densest groups (Client "The Role," Candidate "Your Details" and "The Role") show only their most load-bearing fields by default (3-6 fields) and tuck secondary/optional fields behind a native `<details class="field-disclosure">` ("More scheduling & pay details," "Nationality & next of kin," "Skills & logistics"). This is deliberately a second, distinct pass from the fieldset grouping added earlier — grouping alone still left two 10-11 field walls, which the second critique flagged as "grouping ≠ chunking." No JS needed; `<details>`/`<summary>` are natively keyboard- and screen-reader-accessible.
- **Consent gate**: on the Candidate form, `#candidate-sensitive-group` (the fieldset holding Full Name/DOB/ID Number/Mobile/Email/Address) is HTML-`disabled` by default and only enables once both the POPIA and Screening consent checkboxes are checked (`main.js`, `syncGate()`). A disabled fieldset dims to 0.45 opacity and shows an italic hint ("Confirm both boxes above to unlock this section"). This closes the gap the second critique found between the "Before You Start" copy's promise ("before you type anything in") and what was actually technically enforced (previously nothing — only `required` at submit time).
- **Form tabs**: roving-tabindex `role="tablist"`, `aria-selected` and `tabindex` both update on switch (`main.js` `activateFormTab()`) — fixed from an earlier version where only the visual `.is-active` class updated, leaving screen readers hearing the wrong tab as selected.
- **Category → form handoff**: each category's "Enquire about X" link switches to the Client Enquiry tab and pre-selects that category in the Role Needed dropdown, so a visitor who already told the site what they want doesn't have to repeat it.
- **Checklist**: bordered grid, checkmark-in-box icon (drawn SVG, not emoji/unicode). Forced to a 3-column grid (6 items ÷ 3 = 2 even rows; 2-col under 860px, 1-col under 520px) — the prior `auto-fit`/`minmax` version left a visibly empty 4th-column cell in row 2, caught in the second critique.
- **Form submission**: reads the real JSON response from the Apps Script bridge (plain `fetch`, no `mode: 'no-cors'` — confirmed the bridge's `Access-Control-Allow-Origin: *` header makes the response genuinely readable after the redirect). The success message only shows once `{"status":"ok"}` is actually parsed back, and states a real timeframe/channel; a failed or unreadable response shows a distinct error state directing the visitor to call/WhatsApp instead. Previously this used `no-cors` and showed "Received" unconditionally regardless of whether the submission actually succeeded.
- **`.legal` prose layout** (`privacy.html`): a second page pattern, deliberately Read-mode rather than the homepage's Persuade layout — single-column, max `46rem`, no pattern-rack sidebar. Reuses the site's masthead/footer, `.snapline` divider, and small-caps heading system for continuity, but structures content for comprehension (numbered-feeling `<h2>` sections, a two-column `.legal__grid` only where a real side-by-side comparison helps — "what we collect" split by Client vs. Candidate). Any future Read-mode page (FAQ, terms) should reuse this class rather than forcing the Persuade shell.

## Real brand assets in use

- Logo: `assets/brand/origin-talent-{black,white}.{svg,png}` (real files, from the user's OneDrive folder).
- Photography: `assets/photography/brand/*.png` — real Origin Talent photos for 8 of 10 categories. `assets/photography/sourced/*.jpg` — licensed Pexels placeholders for Private Chefs and Tutors & Governesses only (no real photo exists yet for those two); see `assets/photography/sourced/LICENSES.md`.
- Two "brand kit" PDFs found alongside the real assets are confirmed fabricated (different logo, different tagline, invented stats, a fictional staff member) and were not used for anything — see PRODUCT.md Brand Commitments for the full account.

## Known gaps / next work

- Private Chefs and Tutors & Governesses need real Origin Talent photography once available.
- Two leftover test rows in the [Client Enquiries sheet](https://docs.google.com/spreadsheets/d/1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI/edit) ("DETECTOR TEST - safe to delete" and "DETECTOR TEST 3 - safe to delete", from the second critique's live verification) need manual deletion — automated cleanup attempts keep failing on a flaky Zapier tool call.
- Client Service Agreement and Candidate Application PDF are not yet built as real downloadable files — the Documents section currently routes both to a contact action instead, since the source `.docx` files are explicitly marked "raw drafts, not final" by the agency.
- Required-asterisk color still literally matches heading color (the letter of the original P1 finding was never addressed; in practice the `.opt` "(optional)" tagging on every other field does the differentiation work instead, and the second critique judged this no longer a real usability problem).
- Consent checkbox touch targets are ~17–18px, under the 24–44px guidance — flagged P3 in the second critique, not yet addressed.
- POPIA/legal compliance: Privacy Notice (`privacy.html`) is now built and linked from both consent checkboxes and the footer — see PRODUCT.md's Legal / Compliance section for what it covers and what's still open (PAIA manual, Information Officer registration, Sheets access audit).

## Critique history

**Run 1** (2026-08-19): 24/32 (75%, Good). Two P0s (PII collected before POPIA consent shown on the Candidate form; `no-cors` fetch could show a false "success" message even when the submission failed) and three P1s (form tab `aria-selected` not updating; both forms reading as a generic flat field-wall; required-field markers with no visual salience) — all five fixed same session. `.impeccable/critique/2026-08-19T11-28-25Z__index-html.md`.

**Run 2** (2026-08-20): 29/32 (91%, Excellent), both P0s confirmed closed under independent re-verification. Also caught and fixed live: the phone `pattern` regex threw a console SyntaxError under browsers' stricter v-mode character-class parsing. Remaining P1 ("grouping ≠ chunking" — two fieldsets still 10–11 fields each) and two P2s (checklist grid's empty cell; consent checkboxes advisory-only, not gating) were also fixed in the same session: progressive-disclosure `<details>` splits added to the three densest field-groups, checklist forced to an even 3-column grid, and the Candidate form's sensitive-fields fieldset now HTML-`disabled` until both consent boxes are checked. `.impeccable/critique/2026-08-20T14-20-50Z__index-html.md`. Not yet re-critiqued after this round of fixes.
