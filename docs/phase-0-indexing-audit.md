# Phase 0: Technical and Indexing Audit

Audit date: 2026-10-03
Scope: public indexing foundation and the reported GOBARdhan exclusion.

| Issue | Severity | URL/Component | Cause | Recommended Fix | Status |
| --- | --- | --- | --- | --- | --- |
| Public scheme metadata did not explicitly declare its index state | P0 | `app/yojna/[slug]/page.tsx` | The route emitted `follow` but omitted `robots.index`, leaving the public/private decision implicit while `isIndexableScheme` already defined the policy | Set `robots.index` from `isIndexableScheme(s)` for every scheme route | Fixed in this change |
| Sitemap could advertise records excluded by the publication policy | P0 | `app/sitemap.ts` | Sitemap filtering checked active/sample/source fields but omitted `editorial.publicationStatus === 'REVIEWED'` and review expiry handled by `isIndexableScheme` | Filter sitemap records with the shared `isIndexableScheme` predicate | Fixed in this change |
| GOBARdhan URL is currently a noindex not-found response in production | P0 | `/yojna/gobardhan-scheme-2026` | Production returns the shared not-found metadata (`noindex, nofollow`) and the URL is absent from the production sitemap; the available content is under `/yojna/gobardhan-scheme`, whose record is not indexable | Restore the requested stable slug in the database/content inventory or add a deliberate data-backed alias/redirect; complete editorial review before publishing | Confirmed production blocker; content/slug decision pending |
| Production response headers have been checked in this workspace | P0 | Public production routes | `next.config.mjs` and `proxy.ts` contain no public `X-Robots-Tag: noindex`; live checks also returned no public noindex header | Keep header checks in deployment QA | Verified for homepage, PM Kisan, GOBARdhan, another scheme, category, and state URLs |
| Private-route noindex smoke check fails for `/saved` in the current local run | P1 | `/saved`, `/family`, `/reminders`, `/mere-liye` | The local server returned a transient 500 for these data-dependent requests; production renders `noindex, follow` for all four | Keep private-route metadata and response checks in smoke tests | Production verified; local dev data failure remains |
| Sitemap and robots implementations are present | P1 | `app/sitemap.ts`, `app/robots.ts` | Sitemap uses the canonical `SITE_URL`; robots allows public content and disallows API/admin/private paths | Keep both generated endpoints under route smoke tests | Verified in production |
| Canonicals are generated for public directory and scheme routes | P1 | `app/yojna/[slug]`, `app/category/[id]`, `app/state/[id]` | Route metadata uses `SITE_URL` as metadata base and route-relative canonical paths | Verify rendered canonicals match each requested URL in production | Verified for PM Kisan, another scheme, category, and state |
| Madhya Pradesh state directory is not currently indexable | P1 | `/state/madhya-pradesh` | Production has no reviewed public scheme for the state under the shared policy, so the route correctly emits noindex | Complete editorial review for meaningful state coverage before indexing the directory | Correct policy result; content coverage pending |

## Architecture Snapshot

- Framework: Next.js App Router with React Server Components, plus a Cloudflare/Vinext deployment path.
- Data source: Neon/Postgres when `DATABASE_URL` is available; normalized seed/content fallback otherwise.
- Public scheme route: `app/yojna/[slug]/page.tsx`.
- Shared indexability policy: `lib/seo.ts:isIndexableScheme`.
- Generated crawl files: `app/robots.ts` and `app/sitemap.ts`.
- Response-level controls: `proxy.ts` and `next.config.mjs`; both target admin/private paths, not public scheme routes.
- Public identity: `lib/config.ts:SITE_URL` is fixed to `https://www.sarkariyojanasetu.com`.

## Phase 1 Gate

- [x] Public scheme metadata now has an explicit index/noindex decision.
- [x] Sitemap uses the same public indexability predicate as scheme metadata.
- [x] Category and state metadata now explicitly reflect whether reviewed public schemes exist.
- [x] `robots.ts` allows public routes and disallows private/API paths by source inspection.
- [x] Canonical generation is present for scheme, category, and state routes by source inspection.
- [x] Live production response and header checks.
- [x] PM Kisan live test.
- [ ] GOBARdhan live test after restoring the requested slug/content record.
- [x] Additional reviewed scheme and category live tests; state route checked but correctly noindex until reviewed coverage exists.
- [x] HTTPS/hostname redirect verification.

The Phase 1 gate remains open until the live checks are run after deployment or against a production-equivalent local build.