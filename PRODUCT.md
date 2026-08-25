# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML/CSS/JS, Vite-bundled. This is a brochure/recruitment marketing site (informational pages, two lead-capture forms, a downloadable contract) with no app logic that needs a framework or backend. A plain, fast-loading static build keeps hosting simple and lets animation/motion work run directly against the DOM. Form submission destination (email relay, form service, or serverless endpoint) is still undecided — see Capabilities and Constraints.

## Users

Two primary audiences:

1. **Clients** — households, families, individuals, and private estates (Johannesburg, South Africa) who want to hire vetted, trustworthy domestic and household staff. Likely an affluent, discretion-conscious audience evaluating the agency's credibility before making contact.
2. **Candidates** — prospective staff (au pairs, caregivers, house managers, night nurses, chauffeurs, babysitters, personal assistants, pet care specialists, private chefs, tutors/governesses) applying for placement through the agency.

## Product Purpose

Origin Talent is a professional domestic and household staffing recruitment agency. The website's job is to present the agency's services and screening rigor persuasively enough that a client starts an enquiry, and simply enough that a candidate can apply — while giving both sides a clear, credible next step (online forms, a downloadable client service agreement).

## Positioning

"Exceptional People for Exceptional Homes." Origin Talent's differentiator is a rigorous, verified screening and placement process across ten distinct household-staff specialties — a level of vetting and category specialization an informal referral or general job board can't credibly replicate.

## Operating Context

- Based in Johannesburg, South Africa; clients include private homes and estates. Office: First Floor, Dainfern Square, Cnr Winnie Mandela & Broadacres Drive, Dainfern, Johannesburg, 2191 (sourced from an earlier draft build found in Downloads — not yet re-confirmed with the agency, but a specific real address is unlikely to be invented, so treated as reliable).
- Contact: roger@origintalent.co.za; phone +27 10 502 0105 (same source/caveat as above).
- Client engagement runs through: enquiry → screening/matching → a formal Client Service Agreement.
- Candidate engagement runs through an online application form.
- Domain: origintalent.co.za (existing, per email signature).
- South African data-protection law (POPIA) applies: both forms must capture explicit POPIA consent (confirmed by the real Supabase schema evidence below).

## Capabilities and Constraints

Ten placement service categories, each with agency-supplied descriptive copy (see Evidence on Hand): Au Pair, Caregivers, House Managers, Night Nurses, Chauffeurs, Babysitters, Personal Assistants (Home & Office), Pet Care Specialists, Private Chefs, Tutors & Governesses.

The site must surface three documents supplied by the agency (currently raw/draft, not final per the agency):
- **Client Staffing Enquiry Form** — marked "ONLINE FORM" by the agency; intended to function as a real on-page form, not just a download.
- **Candidate Online Application Form** — likewise intended as a functioning on-page/downloadable application.
- **Client Service Agreement** — a legal contract; intended as a downloadable document, not an on-page form.

Form submissions write to two Google Sheets via a deployed Apps Script Web App bridge (`assets/forms/sheets-bridge.gs`), keyed by a `formType` field (`client` or `candidate`): [Client Staffing Enquiries](https://docs.google.com/spreadsheets/d/1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI/edit) and [Candidate Applications](https://docs.google.com/spreadsheets/d/19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM/edit). Verified working end-to-end. The live endpoint is recorded in `.impeccable/config.json` as `formsEndpoint`. The bridge reads sheet headers dynamically, so header changes never require redeploying it.

Sheet headers were rewritten to match the real field list found in a Supabase schema (`origintalent_supabase_schema.sql`) discovered in an earlier, separate draft attempt at this project (see Evidence on Hand) — this is the actual field taxonomy from Roger's real forms, not a guess:

- **Client Staffing Enquiries** columns: Submitted At, Full Name, Company, Email, Mobile, Alt Phone, Preferred Contact Method, Address, Role Needed, Employment Type, Live-in / Live-out Arrangement, Hours, Urgency, Salary, Driving Required, Languages, Days Needed, Duties, Notes, POPIA Consent.
- **Candidate Applications** columns: Submitted At, Full Name, Date of Birth, ID Number, Nationality, Address, Province, Mobile, Email, Next of Kin Name, Next of Kin Number, Role Applying For, Position Type, Driver's Licence, Own Transport, Availability, Skills, Qualifications, Languages, Legal Right to Work, Able to Perform Duties, Screening Consent, Declaration, POPIA Consent.

Open/undecided: whether the raw draft copy in the two form documents and the service agreement is legally final (agency flagged them as drafts — do not silently treat as finished legal text).

## Legal / Compliance

A `/legal:compliance-check` run on 2026-08-20 identified several POPIA gaps (see that skill's output for the full assessment). Status:

- **Privacy Notice — done.** `privacy.html` covers what's collected, why, who it's shared with (including the fact that candidate data is shared with prospective client households — the core of what a staffing agency does), retention (12 months default for non-placements, agreement-duration for placements), cross-border processing via Google, and POPIA data-subject rights with a complaint path to the Information Regulator. Linked from both consent checkboxes and the footer.
- **PAIA Manual — done.** `paia-manual.html` follows the Information Regulator's own private-body template (fetched directly from inforegulator.org.za) section-for-section: contact details, the categories of records held (with and without a formal request), what personal information is processed and why, recipients, cross-border transfer, security measures, and manual availability/update commitments. Linked from the footer on every page. No Deputy Information Officer is named (none is appointed) — don't fabricate one if asked to fill this in later.
- **Registering an Information Officer and submitting the manual are two different things.** Registering an IO with the Information Regulator (via their online portal at inforegulator.org.za) is a real, binding legal filing under the company's own authority — this needs to be done by Roger directly, not by me. The PAIA manual itself isn't "registered" or submitted anywhere; POPIA's amendment to PAIA only requires it be published/made available (which is now done). Separately, there's a recurring **Annual PAIA Report** (distinct from the manual) that must be filed via the Regulator's eServices portal each year between 1 April and 30 June — also something Roger needs to do himself when that window opens, not a one-time setup task.
- **Still open:** formal Information Officer registration with the Information Regulator (the Privacy Notice and PAIA Manual both name Roger Donaldson as Information Officer, but this is a default assumption pending actual registration), audit of who has access to the two Google Sheets (real security exposure, independent of any document), and finalizing the Client Service Agreement (still an agency-flagged draft).
- The 12-month/agreement-duration retention period stated in the Privacy Notice is a reasonable default I set, not something the agency confirmed — flag this to Roger before treating it as final.

## Brand Commitments

- Name: **Origin Talent**, styled as the lockup "origin | talent" (thin lowercase "origin" + bold lowercase "talent", divided by a vertical rule).
- Tagline: "Exceptional People for Exceptional Homes."
- Logo supplied in light-on-dark and dark-on-light variants. **Correction (2026-08-25): there is no secondary lockup with a tagline/URL/location.** Every source folder under `C:\Users\user\OneDrive\Origin Talent\` (png/svg/jpg/pdf, four separate exports) contains exactly the same three files — "Black Logo," "Black Text," "White text" — and all three are color/style variants of one plain wordmark, verified by exhaustive alpha-channel row/column scanning (identical single content band, no separate tagline text anywhere). "Black Logo" and "Black Text" are near-pixel-identical (1554px vs 1552px wide). The earlier claim of a beneath-the-mark tagline/URL/location lockup was inaccurate and should not be trusted; where a fuller lockup is needed on the site, it's built in code (real HTML text under the plain wordmark image), not from a supplied asset — see `.contact__lockup` in DESIGN.md.
- **Current logo files in use are the genuinely transparent PNGs**: `assets/brand/origin-talent-{black,white}-transparent.png` (masthead + footer on all pages; the Contact page's code-built lockup also uses the black version). These supersede the earlier `origin-talent-black.svg`/`.png` and `origin-talent-white.svg`/`.png`, which had a baked-in white background rather than real alpha transparency — verified via `GetPixel().A` before swapping. The old files are still present in `assets/brand/` but should be treated as deprecated, not deleted (in case a dark-background placement is ever needed and a genuinely transparent white version is sourced). A separate `origin-talent-lockup-black-transparent.png` existed briefly (2026-08-24–25) under the mistaken belief it held a tagline lockup; removed once pixel inspection showed it was the same wordmark as `-black-transparent.png` with no distinct content.
- **Pinned typeface: Century Gothic** (the logo's typeface, confirmed directly by the user). Century Gothic is not a free web font; ship it first in the font stack for users who have it installed (common on Windows), with a self-hosted free geometric-sans fallback (Jost) for everyone else — this is the "closest obtainable face" concession, not a substitution of the brand's choice.
- **Palette: grayscale base, one brass accent added 2026-08-24 per direct client feedback** (Roger: "I would enjoy creative bursts of colour"). Base remains `#f0f0f0` (paper/background), `#474747`/`#444444` (ink), `#ffffff` (white) — this is still the confirmed foundation, not invented. `#a8752b`/`#7c561f` (brass) was added afterward, deliberately restrained to focal points only (primary CTA, hero emphasis word, active nav tab, category pins) — see DESIGN.md Colors section for the full rationale and where it is/isn't used. The earlier "no color accent anywhere" rule no longer holds; treat the brass addition as current and intentional, not a drift to flag.
- **Do not trust either "brand kit" PDF found in the OneDrive folder** (`Origin Talent brand kit.pdf` and `Origin Talent new logo design & brand kit.pdf`). Both are fabricated: one invents a navy/gold palette, a sparkle "running figure" logo, the tagline "Peace of Mind, Every Day," Fraunces/Inter/Dancing Script type, and fake stats ("10,000+ families trust Origin Talent," 5-star ratings); the other invents an "OT" monogram, Libre Caslon/Work Sans type, and a fictional "Managing Partner, Anne Whitfield." Neither matches the real logo files or the real tagline confirmed everywhere else. They appear to be leftovers from the same earlier abandoned draft as `origin-talent-recruitment.html` (see Evidence on Hand). The real, confirmed name/phone/address they happen to share with genuine sources does not make the rest of either document trustworthy.
- Real Origin Talent photography exists for 8 of the 10 categories (Au Pair, Babysitters, Caregivers, Chauffeurs, House Managers, Night Nurses, Pet Care Specialists, Personal Assistants), sourced from `C:\Users\user\OneDrive\Origin Talent\` and mirrored into `assets/photography/brand/`. Style is warm, naturalistic, documentary-toned, diverse subjects, muted neutral interiors and exteriors — this is the established photographic voice. Private Chefs and Tutors & Governesses have no real photo yet and use a licensed free placeholder (`assets/photography/sourced/`) pending real assets.
- Photography for Babysitters, Personal Assistants, Pet Care Specialists, Private Chefs, and Tutors & Governesses was not supplied by the agency. Free-use placeholder photography (Pexels License — free commercial use, no attribution required) has been sourced for these five categories, matching the established warm/documentary/diverse/muted-neutral style; stored at `assets/photography/sourced/` with a license record in `assets/photography/sourced/LICENSES.md`. Treat as placeholders to swap for genuine Origin Talent photography if/when the agency supplies it — do not present them as real agency photos.

## Evidence on Hand

- Full per-category website copy (verbatim, from Roger Donaldson, Origin Talent, email "Website Text and Picture Examples," 2026-07-14): intro paragraph, all 11 category descriptions, a "Why Choose Us" bullet list, and a closing CTA paragraph.
- Logo files: light lockup, dark-background lockup, and a version with tagline/URL/location detail (provided directly by the user).
- Category lifestyle photography (provided directly by the user) for the categories listed under Brand Commitments.
- Three draft documents attached to Roger Donaldson's email "Contract and Online Forms" (2026-07-14), explicitly described by the agency as "raw" and "not final," meant only to show what must be downloadable/available from the site:
  - `Candidate Online Application Form OT.docx`
  - `Client Staffing Enquiry Form - ONLINE FORM OT.docx`
  - `CLIENT SERVICE AGREEMENT - ORIGIN TALENT.docx`
- An earlier, separate draft attempt at this same project was found in `C:\Users\user\Downloads\` (dated 2026-07-20, roughly four weeks before this build): a full static homepage (`origin-talent-recruitment.html`) in a navy/gold Fraunces+Dancing Script+Inter visual system, and `origintalent_supabase_schema.sql`, a Postgres/Supabase schema for the two forms with real field names (see Capabilities and Constraints). The user chose to discard that draft's visual direction and build fresh, but its schema is genuine evidence of the real form fields and its metadata surfaced the real office address and phone number (see Operating Context). That HTML draft also contains fabricated trust signals — "10,000+ placements," "98% satisfaction," a 4.8/112 review rating — with no supporting evidence anywhere; do not carry these into the new build.

## Product Principles

1. **Trust and discretion first.** Premium household staffing for private homes and estates demands a polished, credible, non-generic presentation — this is not a mass-market job board.
2. **Two clear audiences, two clear paths.** A client enquiry and a candidate application are different journeys; both must be effortless to find and start without competing for the same attention.
3. **Real people, real service.** Lead with the agency's genuine photography and its actual screening process rather than generic staffing-agency stock imagery or vague claims.
4. **Category clarity over category overload.** Ten distinct services need to read as scannable and organized, not as an exhausting list.
5. **Forms are core product, not an afterthought.** The staffing enquiry form, the candidate application, and the downloadable service agreement are the site's primary conversion paths and deserve first-class design, not a bolted-on contact page.
