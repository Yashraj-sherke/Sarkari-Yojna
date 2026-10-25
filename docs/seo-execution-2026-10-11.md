# SEO execution — 11 October 2026

## Scope and evidence

Local repository implementation, source review, read-only live checks, tests and builds. No deployment, production database writes, Search Console submissions, social posts, outreach messages or AdSense application have been performed. No recurring automation was created.

No applicable AGENTS.md was found in this checkout or its ancestor directories. Scheme content follows `.agents/skills/scheme-researcher/SKILL.md`. Existing uncommitted state-scheme work was preserved.

Confirmed: Next.js 16.2.6 / React 19.2.6; separate Vinext 1.0.0-beta.5 / Cloudflare build; Neon-backed content with a fallback catalogue. The fallback contains 168 records, 165 public-status records, 7 editorially reviewed records, and 161 requiring editorial review. These are repository counts, not production database or indexed-page counts.

Confirmed live HTTP probe: homepage, robots and sitemap returned 200; sitemap contained 192 entries. HTTP bare domain redirects to HTTPS bare domain, then HTTPS www, using 308. This two-hop chain is functional; removing the first hop is a hosting decision, not required to replace a valid permanent redirect.

Search Console counts in the pasted runbook are historical user-supplied claims. No current property, query exports, backlinks report or field Core Web Vitals were available. Search rankings and AdSense approval are not implementation acceptance criteria.

The configured Sites project has no live URL and no saved versions. It therefore does not establish the deployment target for the public custom domain. No new Site was registered and no source credential was requested. Existing custom audience remains unchanged.

## Phase 1 — Technical indexing

Implemented:

- Removed duplicate `public/robots.txt`, which contained a misspelled sitemap domain. The dynamic robots route is the single source.
- Removed crawler-specific permissive groups that overrode shared exclusions. Kept `/api/` and `/out/` excluded; admin and utility HTML can be crawled to observe noindex.
- Set saved, reminders, family and personal eligibility tools to noindex/follow. Admin noindex remains intact.
- Replaced unconditional scheme indexability with explicit public statuses; samples and unpublished records cannot enter the sitemap. Existing unreviewed public records are not bulk deindexed.
- Kept public articles accessible after review expiry (`NEEDS_REVIEW`, `UPDATE_REQUIRED`), with visible verification warnings rather than converting their URLs to 404.
- Added permanent bare-domain-to-www redirect, preserving paths; Next.js uses 308.
- Included public news, certificate and status hubs in the sitemap; retained content-derived modification dates.
- Extended the crawl to child sitemaps, headers and Googlebot metadata, canonical mismatch detection, HTTP errors and incoming-link counts. Public scans are bounded and do not execute JavaScript.

Remaining: audit the supplied 59 Search Console URLs against current exports, verify production after deployment, submit sitemap and request selected URL inspections. No indexing increase is claimed.

## Phase 2 — Scheme template

Retained existing answer box, quick facts, eligibility, benefits, documents, application process, FAQs, breadcrumbs and references. Improved related links, explicit verification labels, cache interval and search metadata. Unverified descriptions no longer advertise their benefit as confirmed. Missing editorial dates say “सत्यापन आवश्यक”; the actual editorial note is shown, including source conflicts.

Article schema no longer fabricates `datePublished` from a modification date. The editorial team is an Organization rather than an invented Person. FAQ schema is emitted only for core-verified records. JSON-LD remains escaped.

Replaced the 800px logo fallback with a visually checked, code-rendered 1200 × 630 social card (`public/og-default.png`). Large previews are enabled using the actual Next.js robots key. This is a social fallback, not a promise of Discover inclusion or a substitute for relevant article photography.

Remaining: official Rich Results Test and factual review of unreviewed articles. No fabricated first-publication dates were added.

## Phase 3 — Page mapping and factual content

Generated `artifacts/seo/runbook-2026-10-11/inventory.json` and `target-pages.md`. The 20 candidates use actual URLs and geography; Abhyudaya belongs to Uttar Pradesh and is excluded from the MP queue. Query popularity and positions are unknown.

Corrected PM-KISAN summary, description and introductory eligibility language: eligible landholding farmer families, not automatic benefits for every farmer. Recorded a limited source check dated 11 October 2026, without refreshing the whole article's review date. Source: https://www.pmkisan.gov.in/ . Official search evidence confirms ₹6,000 annually in three equal installments, family definition and exclusions. Full application flow and document requirements were not newly verified. Citizen-facing change summary and database-shaped JSON are exported separately.

Current Ladli Behna portal evidence still mixes ₹1,500 benefits with a ₹1,250 exclusion threshold. Existing conflict flag remains; this was not resolved by guessing. Source: https://cmladlibahna.mp.gov.in/ . The government e-services list shows Swarojgar and Udyam Kranti as separately named services; do not assume every similarly titled record should be merged. Source: https://www.services.mp.gov.in/eservice/eServices?srvs=8 . Rani Durgavati discovery returned historical material, not a complete current application notice; its 2026 claims are not newly certified.

Shared source URLs are recorded as duplicate-review candidates, not proof of keyword cannibalization. Existing URLs were preserved.

Remaining: current official guidelines, application windows and full factual verification for the remaining target pages; current Search Console query-to-page export. The 20-page rewrite/indexing milestone is not complete.

## Phase 4 — Internal linking

Related selector returns up to five relevant published-status schemes, preferring explicit relations, shared category and state. Other-state-only schemes are excluded for state-specific articles. Sparse categories may legitimately have fewer than five; unrelated links are not added to meet a quota. Directory cards exclude unpublished records. Existing category, state, guide and homepage discovery links remain. Fourteen repository records have fewer than five related candidates.

The first complete HTML scan checked 204 URLs, including all 197 local sitemap URLs, with no network failures and no sitemap HTTP/noindex/canonical conflicts. It found duplicated H1 headings, an unlinked status directory and links to five nonexistent Ayushman guides. Follow-up fixes demote imported H1 headings, correct the state-hub hierarchy, add a footer link to the status directory and point unavailable Ayushman guide links to the existing pillar. Unsupported scheme shortcuts now link to the relevant category; fabricated deadline/installment headlines were removed from navigation labels.

The initial crawl also found matching metadata for three pairs: `employment-support` / `mp-mukhyamantri-udyam-kranti-yojana`, `kisan-kalyan` / `kisan-kalyan-yojana`, and `deendayal-antodaya-rasoi-yojana` / `deendayal-rasoi-yojana`. These remain consolidation-review tasks; no irreversible URL merge was inferred from title equality alone. Initial evidence is retained in `crawl-before-followup.json`.

Crawler reports incoming links from distinct scanned HTML pages. Outgoing related links are not treated as proof of incoming-link coverage. Search Console is a sampled report; no 800-link promise is made.

Remaining: investigate genuine orphan candidates from the complete crawl and measure production after deployment.

## Phase 5 — Content freshness

Existing news and related-update blocks remain; no unsupported daily news or installment claims were generated. The inventory flags missing sources, source dates, review dates, documents, application process and FAQs.

Remaining: source-first editorial work for real announcements. Publication volume is subordinate to verified useful information. Closed schemes should retain useful historical context and an explicit status rather than being mislabeled active.

## Phase 6 — Channels and external links

No account changes, social publication or outreach messages were sent. Existing links remain. PDFs, scam alerts and outreach require verified material and an authorized channel. Do not claim backlinks from social profile creation alone.

## Phase 7 — Monitoring

Added repeatable PowerShell-compatible npm commands:

```powershell
npm run seo:inventory
npm run seo:live
# After starting the production preview on port 3100:
$env:SEO_AUDIT_ORIGIN = 'http://127.0.0.1:3100'
$env:SEO_AUDIT_LIMIT = '500'
npm run seo:audit
```

Start preview with `node node_modules/next/dist/bin/next start --port 3100` after a successful `npm run build`. This avoids npm argument forwarding differences in PowerShell. Scans save local/production reports separately. The live probe saves redirect/robots/sitemap evidence. A failed network request is not an SEO finding.

Monday tracker (all current Google metrics remain unavailable):

| Review date | Indexed | Clicks / impressions / CTR / position | Action |
|---|---|---|---|
| 12 October 2026 | Unavailable | Unavailable | Import current Search Console exports; deploy and verify approved changes |
| 19 October 2026 | Unavailable | Unavailable | Compare indexing reasons and query-to-page performance |
| 26 October 2026 | Unavailable | Unavailable | Recheck official sources for priority pages |
| 2 November 2026 | Unavailable | Unavailable | Compare meaningful edits and outcomes |

## Phase 8 — Monetization

Existing About, Contact, Privacy, Terms and Disclaimer pages remain. No advertising account application or ad placement was made. Content review, policy checks and actual visitor data remain prerequisites for a readiness decision. No income date or approval guarantee is claimed.

## Validation

Nine regression tests cover unpublished/sample exclusion, public URL preservation, relevant links, unverified metadata, imported headings and unavailable guide targets, crawl directives, sitemap redirects and canonical mismatches. Next.js and Vinext build checks plus rendered HTML audit are recorded in the task's final result. No lint or field Core Web Vitals pass is claimed. Do not mistake a passed build for verified indexing or a completed editorial review.

Final results: nine tests passed, `tsc --noEmit` passed, Next.js production build passed, Vinext/Cloudflare build passed, HTTP QA passed. The final crawl checked 198 URLs, including all 197 sitemap URLs. Sitemap URLs had zero non-200 responses, noindex directives, canonical mismatches or H1-count failures. There were zero network failures, zero orphan candidates and no scan limit truncation. Minimum incoming coverage among scheme articles was four distinct scanned pages; a five-incoming-link minimum is not claimed. Twelve duplicate-metadata observations correspond to the three review pairs above. Some titles remain long by an editorial heuristic; that is not a ranking error.

Summary evidence: `artifacts/seo/runbook-2026-10-11/validation.json`. Full final crawl: `artifacts/seo/local/latest.json`. Local production preview: `http://localhost:3100/yojna/pm-kisan`.

## Review boundary

The scheme-researcher skill says: “Never automatically publish a scheme if authoritative source is unavailable, eligibility is contradictory, benefit amount is uncertain, application URL is uncertain, scheme status is uncertain, source is outdated, or official documents conflict.” Existing review flags remain. Preparing local template improvements does not authorize resolving those factual gaps by assumption or presenting unreviewed records as newly verified.
