# Current-state architecture — 27 September 2026

## Evidence before changes

- Existing Next.js 16 App Router / React 19 application; Next production and vinext/Cloudflare build paths coexist. Preserve both.
- Neon PostgreSQL through `lib/server.ts`; JSON scheme records, separate news table, static seed fallback.
- `/`: interactive directory, first nine central schemes, news marquee, FAQ, organization/website/collection JSON-LD.
- `/yojna`: existing directory, self-canonical, omitted from the live sitemap.
- `/yojna/[slug]`: metadata, Article and BreadcrumbList; current route accepts ACTIVE/CLOSED/ARCHIVED, review expiry can result in a missing page.
- `/category/[id]`: eight audience/category hubs, conditional indexing based on reviewed records.
- `/state/madhya-pradesh`: conditional indexing; `/state/central` redirects to `/`.
- `/guide` and three `/guide/[slug]` pages; no `/documents` routes. Existing income-certificate guide should be improved rather than duplicated.
- `/praman-patr`: document overview, deliberately noindex; uncited fee, time and eligibility statements require verification.
- `/samachar` and `/samachar/[slug]`: intentionally noindex. Published database news plus static fallback; no source/verification fields in the public news schema.
- `/mere-liye`, `/saved`, `/family`, `/reminders`: private/personalized journeys, noindex.
- `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`: indexable information pages.
- `/admin`: session-gated dashboard, scheme and news editors, AI draft tools, sources. Dashboard noindex does not automatically protect sibling routes. Client login has no metadata wrapper.
- `/admin/api/*`: authenticated mutations; `/api/cron/daily-news`: scheduled draft endpoint. GitHub workflow is configured for 09:30 IST; actual execution/secrets not verified.
- `robots.txt`: allows public crawling, blocks `/api/` and `/out/`, references canonical sitemap.
- `sitemap.xml`: live HTTP 200, 14 absolute www/HTTPS URLs, real stored dates, two reviewed scheme URLs; no private URLs. Single sitemap appropriate at this scale.
- `SchemeIndex` currently returns null (comment says intentionally disabled). Do not undo that visual decision. Directory pagination is client-button based.
- News generator asks an ungrounded language model to identify trends/new schemes. This is NOT evidence of public demand or a government announcement.

## Priority and proposed changes

1. P0: private-route noindex inherited at layouts, plus response headers. Keep authentication; robots is not security.
2. P0: add existing `/yojna` to sitemap; retain quality-driven exclusions for news, documents and unreviewed schemes.
3. P0: fail closed when cron secret is missing; do not invoke billable generation during audit.
4. P1: bounded read-only public HTML crawl with canonical/title/H1/description/robots/link/schema checks; label incomplete scans and network failures.
5. P1: authenticated SEO health screen: saved crawl evidence plus database content-readiness checks, never fabricated Google metrics.
6. P1: replace unsupported homepage benefit answers with uncertainty and official-source guidance, not new unverified claims.
7. P1: reviewed-scheme links on the existing directory only, without restoring the disabled homepage index.

Existing uncommitted work is preserved. No deployment, publication, database migration or government-source verification is implied by this audit.
