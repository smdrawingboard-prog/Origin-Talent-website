# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The live marketing site for Origin Talent, a Johannesburg domestic/household staffing
agency ("Exceptional People for Exceptional Homes"). Plain static HTML/CSS/JS — no
build step, no framework, no package.json. Deployed as-is via GitHub Pages.

Four pages, all hand-written HTML sharing the same masthead/footer markup and
`src/style.css` / `src/main.js`:
- `index.html` — the homepage: hero, ten staffing-category cards, the two lead forms
  (Client Staffing Enquiry / Candidate Application), a document-download section.
- `contact.html`, `privacy.html`, `paia-manual.html` — secondary pages using the
  `.legal` single-column "Read mode" layout (see DESIGN.md) instead of the homepage's
  pattern-rack layout.

## Running it locally

No build/install step. Serve the directory with any static server, e.g.:

```
npx serve -l 5500 .
```

(`.claude/launch.json` runs this same command.) There is no lint/test/build command —
verify changes by loading the page directly.

## Architecture

**Forms → Google Sheets, not a database.** Both lead forms POST as JSON to a Google
Apps Script Web App endpoint hardcoded in `src/main.js` (`FORMS_ENDPOINT`), keyed by a
`formType` field (`client` or `candidate`). The bridge script itself lives at
`assets/forms/sheets-bridge.gs` and must be manually redeployed/copied into the Apps
Script editor if changed — editing the `.gs` file in this repo does not update the live
endpoint. It reads each destination sheet's header row dynamically and maps form fields
to columns by name, so **adding a form field only takes effect if a matching column
already exists in the target Google Sheet** — the bridge doesn't create columns.
Sheet IDs and URLs are in `PRODUCT.md` and the `.gs` file's header comment. Do not
confuse this with `.impeccable/config.json`'s `formsEndpoint` value or any Supabase
references found elsewhere (see "Do not confuse with" below) — the endpoint in
`src/main.js` is the one actually wired to the live `<form>` submit handlers.

**`src/main.js` is one file wiring up everything on the homepage**: scroll-spy
highlighting for the pattern-rack nav, reveal-on-scroll for category cards, the
mobile rack drawer toggle, client/candidate form-tab switching, a "category → form"
handoff (clicking "Enquire about X" switches to the enquiry tab and pre-selects that
role), a POPIA consent gate that keeps the candidate form's sensitive-fields `<fieldset>`
`disabled` until both consent checkboxes are checked, and the form submission/status
handling described above. It's not modularized — new interactive behavior on the
homepage generally goes in here as another self-contained block, following the existing
pattern of guarding each block with an `if (elementsExist)` check so it's a no-op on
pages that don't have that markup.

**One shared design system, two page layouts.** `src/style.css` is a single stylesheet
for all four pages. The homepage uses the "pattern rack" layout (sticky left category
nav + main content, see `.shell`/`.rack`); the other three pages use `.legal`
(single-column, no rack). Masthead/footer markup is duplicated across all four HTML
files rather than templated (no build step to share partials) — when changing the
masthead or footer, all four files need the same edit. `.masthead__contact` is hidden
under 900px on the homepage (its content moves into the `.rack` drawer via
`.rack__contact`), but stays visible/wrapping on the three pages without a rack — see
the `:has()` scoping in the Masthead section of `src/style.css` if touching this; it's
easy to accidentally hide contact info entirely on a non-homepage page.

**Logo assets have real content occupying only a fraction of their canvas.**
`assets/brand/origin-talent-*-transparent.png` files are cropped to their real content
bounding box already, but if new brand assets are ever swapped in, check their real
aspect ratio before wiring up CSS — see the "Logo asset fix" entry in DESIGN.md for the
exact failure modes (CSS `height` + `width:auto` uses the file's own intrinsic ratio,
not any HTML `width`/`height` attribute hint, once the image has loaded; explicit
`width`+`height` on a mismatched-ratio file silently stretches it via the default
`object-fit: fill`).

## Do not confuse with

There is a separate, earlier/parallel repo (`Origin-Talent`, without the `-website`
suffix) whose README describes a Supabase-backed version of this same site (tables,
RLS policies, a staff dashboard). That is not this repo and is not what's deployed —
this repo's forms go to Google Sheets via Apps Script, per above. Don't port Supabase
assumptions in here without checking which repo is actually live first.

## Project memory files

- `DESIGN.md` — visual system (colors, type, motifs, component-level decisions) with a
  dated history of client-feedback-driven changes. Read before any visual change so you
  don't re-introduce something a client explicitly asked to change (e.g. the grayscale
  photography filter was deliberately removed, an accent color was deliberately added).
- `PRODUCT.md` — product context: audiences, positioning, the real vs. fabricated brand
  assets found during earlier research (two "brand kit" PDFs in the source OneDrive
  folder are confirmed fabricated — don't trust them if referenced), POPIA/PAIA
  compliance status, and what's still open with the agency.
- `.impeccable/critique/` — dated design-critique reports from earlier build passes.
