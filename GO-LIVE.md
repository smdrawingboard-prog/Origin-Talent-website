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

Status as checked on 2026-09-01:

- The two **live** spreadsheets are:
  - Client Staffing Enquiries: `1fc9HJ_2UgPpeT35oPqBZwLHBEuzFFZJDy10NsmbdNdI`
  - Candidate Applications: `19xvTEvzyNXVM2-LmrMZgJUFMUZ7g6-0ymYNv9mnv1nM`
  Both sheets' header rows match the site's form field names exactly.
- **Client form: verified end-to-end** — Faye's own live-site submission of
  2026-08-25 is in the Client Enquiries sheet. The old "DETECTOR TEST" rows
  noted in DESIGN.md are already gone. Faye's test row can be deleted once
  no longer needed.
- **Candidate form: needs one browser test.** The Candidate Applications
  sheet has correct headers but no rows yet, so the candidate path has no
  recent proof. Submit the candidate form once from the live site (Full Name
  "TEST — safe to delete"), confirm the on-page success message and the new
  row, then delete the row. (Direct endpoint testing wasn't possible from
  the build environment — its network policy blocks `script.google.com`.)
- **Duplicates archived (2026-09-01):** the two leftover 2026-07-16
  spreadsheets ("Origin Talent – Client Staffing Enquiries" /
  "– Candidate Applications", old column taxonomy, no real data) were renamed
  with an "[ARCHIVED — duplicate, superseded 2026-08-18]" prefix. They were
  deliberately not trashed; trash them from Drive whenever convenient. Do
  **not** delete the two live IDs above.
- While in Drive: audit who has access to the two live sheets (PRODUCT.md
  flags this as an open POPIA item) — they hold candidate ID numbers.
