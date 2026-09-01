# Go-live checklist — origintalent.co.za

The repo now carries everything the site itself needs for launch (robots.txt,
sitemap.xml, canonical URLs, structured data, service pages, `CNAME` file).
The steps below are the ones that can only be done from outside the repo —
in the domain's DNS, in GitHub settings, in Google Search Console, and in the
Google account that owns the form spreadsheets.

## 1. Custom domain (origintalent.co.za)

The repo's `CNAME` file already declares `origintalent.co.za`. **Note: the
moment this branch merges, GitHub Pages will start redirecting the
`*.github.io` URL to the custom domain — so do the DNS records first (or at
the same time), otherwise the site becomes unreachable until DNS is in place.**

1. At the DNS host for `origintalent.co.za`, create:
   - Four **A records** on the apex (`@`) pointing to GitHub Pages:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (Optional but recommended, for IPv6) four **AAAA records** on `@`:
     `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - A **CNAME record** for `www` pointing to `smdrawingboard-prog.github.io.`
     (GitHub then redirects `www.origintalent.co.za` → apex automatically.)
   - Remove/replace any existing A/CNAME records on `@` and `www` that point
     at an old host or parking page. Leave MX records alone — email at
     `@origintalent.co.za` is unaffected by A/CNAME changes.
2. In the GitHub repo: **Settings → Pages → Custom domain**, enter
   `origintalent.co.za` and save. Wait for the DNS check to pass, then tick
   **Enforce HTTPS** (the certificate can take up to ~24 h to issue).
3. (Recommended) **Settings → Pages → verified domains** (account level:
   Settings → Pages → Add a verified domain): verify `origintalent.co.za`
   with the TXT record GitHub gives you, so nobody else can claim the domain
   on GitHub Pages.
4. Check: `https://origintalent.co.za/` loads with a padlock;
   `https://www.origintalent.co.za/` and the old
   `https://smdrawingboard-prog.github.io/...` URL both redirect to it;
   `https://origintalent.co.za/robots.txt` and `/sitemap.xml` load.

## 2. Google Search Console

Do this after the domain is live (Search Console can only verify a domain
that resolves).

1. Go to https://search.google.com/search-console and sign in with the Google
   account that should own the property (Roger's).
2. Add a property — choose the **Domain** property type and enter
   `origintalent.co.za` (covers http/https and www/non-www in one property).
3. Verify via the **DNS TXT record** Google shows you (added at the same DNS
   host as step 1; propagation can take a few minutes to a few hours).
4. Once verified: **Sitemaps** (left menu) → enter `sitemap.xml` → Submit.
   It should show "Success" with 15 discovered URLs.
5. **URL inspection** → paste `https://origintalent.co.za/` → Request
   indexing. Repeat for one or two service pages to prime the crawl.
6. After a few days, check **Pages** (indexing report) and **Enhancements**
   for structured-data errors. The JSON-LD on the site can also be spot-checked
   any time at https://search.google.com/test/rich-results.

## 3. Sheets management dashboard

`assets/forms/dashboard.gs` builds a Dashboard tab (totals, last 7/30 days,
per-status and per-role breakdowns, latest 10 submissions) plus a "Status"
dropdown column in each of the two live spreadsheets. Like the bridge script,
it must be installed manually — editing the file in this repo deploys nothing:

1. Open either sheet → **Extensions → Apps Script** (the project that already
   hosts `sheets-bridge.gs`).
2. Add a new script file, paste the whole of `dashboard.gs` in, save.
3. Run `buildDashboards()` once from the editor and authorize it.
4. Re-run it any time to refresh; it never touches submission rows.

The added "Status" column is safe for the form bridge (the bridge fills
columns by header name and leaves unknown columns blank).

## 4. Forms + spreadsheet housekeeping

- Both forms POST to the Apps Script endpoint hardcoded in `src/main.js`.
  A test submission per form (clearly marked, e.g. Full Name
  "TEST — safe to delete") should return the success status message on the
  page and appear as a new row in the matching sheet.
- Delete test rows afterwards — including the two old
  "DETECTOR TEST … safe to delete" rows still sitting in the Client
  Enquiries sheet (noted in DESIGN.md).
- The two **live** spreadsheets are:
  - Client Staffing Enquiries: `1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI`
  - Candidate Applications: `19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM`
  Any other spreadsheet in Drive with the same/similar name is a leftover
  duplicate: rename it "[ARCHIVED] …" and/or move it to an Archive folder so
  nobody enters data into the wrong one. Do **not** delete the two live IDs.
- While in Drive: audit who has access to the two live sheets (PRODUCT.md
  flags this as an open POPIA item) — they hold candidate ID numbers.
