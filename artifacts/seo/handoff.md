# SEO Implementation Handoff

## Continuation update — 30 September 2026

- Fixed private admin behavior: unauthenticated `/admin` routes now return a real 307 to the newly added `/admin-login` page and carry `X-Robots-Tag: noindex, nofollow`.
- Removed the client-rendering bailout that left the homepage without an H1 in initial HTML.
- Added crawlable, numbered pagination with a clean page-one URL and page-specific `/yojna?page=N` canonicals.
- Added a server-rendered reviewed-scheme index so every sitemap scheme is directly discoverable from `/yojna`.
- Cleared the remaining lint warnings in admin previews and language initialization.
- Current checks: lint clean; TypeScript pass; core tests 31/31; SEO tests 14/14; Next build pass; Vinext/Cloudflare build pass.
- No deployment, live database mutation, Search Console action, or field-performance measurement was performed.

## Completed Changes
- **Technical & UX Enhancements**: Optimized the homepage directory to feature the Top 6 `priority` schemes. Removed heavy stock images from scheme cards in favor of fast-loading SVGs to drastically improve mobile LCP. Replaced the duplicated HTML `<marquee>` with an accessible, vertical updates list.
- **Content Expansion**: Engineered and seeded 3 core clusters (`pm-kisan`, `ayushman-bharat`, `pm-awas-gramin`) with verified facts, official URLs, structured benefits, and eligibility rules mapped strictly to government sources.
- **Documentation**: Developed all required SEO audits and strategies (competitor baselines, matrix, cluster plans, URL policy, and backlink plans).

## Changed Files
- `components/site.tsx`: Refactored `Card` component to drop `OfficialImage` and use category icons.
- `components/directory.tsx`: Re-architected homepage state, featured schemes list (max 6), and news marquee.
- `lib/domain.ts`: Updated Fuse.js search logic to sort by `priority` first.
- `lib/scheme-summary.ts`: Added `priority` boolean to `SchemeSummary`.
- `app/page.tsx`: Altered default directory state to `all`.
- `lib/official-content.ts`: Added thoroughly verified data for `ayushman-bharat` and `pm-awas-gramin`.
- `app/admin/news/page.tsx`: Fixed ESLint unescaped quotes error.

## Checks and Results
- **TypeScript/ESLint**: Ran `npm run lint`, fixed errors, 0 build-blocking errors remain.
- **Production Build**: Ran `npm run build:cf` (Vinext target). Passed successfully (3.36s client, 2.39s server).
- **Sitemap & Robots Validation**: Verified `app/sitemap.ts` correctly excludes `isSample: true` and unreviewed content. Validated `app/robots.ts` allows correct crawling paths.

## Remaining Work
- Complete manual editorial reviews for the 129 MP State schemes.
- Execute the remaining central scheme clusters (Ujjwala, Vishwakarma, MUDRA).
- Develop the embeddable "Scheme Status Tracker" widget for backlinks.

## Verification Blockers
- Real-world Core Web Vitals (CWV) require 28 days of Chrome User Experience Report (CrUX) data after deployment to definitively prove LCP improvements in the field.
- Cloudflare edge caching behavior must be verified on the live URL.

## Production Operations Not Performed
- Did not deploy to production.
- Did not write to the live production Neon PostgreSQL database (used local execution only).
- Did not connect to external Google Search Console or Indexing APIs.

## Exact Next Steps
1. Deploy this codebase to the Cloudflare Pages staging environment.
2. Run automated Lighthouse CI tests on staging to verify LCP < 2.5s.
3. Validate database migrations (or seed script) on the production Neon DB instance.
4. Push to production and monitor GSC for indexing of the 3 new central scheme pages.

---

## 30/60/90-Day SEO Plan

### First 30 Days (Foundation & Indexing)
- **Goal**: Monitor the performance of the newly deployed UX and the first 3 core clusters.
- **Action**: Check Google Search Console weekly for crawl errors, indexed pages, and impressions for `pm-kisan`, `ayushman-bharat`, and `pm-awas-gramin`.
- **Action**: Generate and review the next batch of 15 high-priority schemes.

### Next 60 Days (Authority & Clusters)
- **Goal**: Expand topical authority in the MSME and Women's Empowerment categories.
- **Action**: Seed the next 3 clusters (Ladli Behna, Ujjwala, PM Vishwakarma).
- **Action**: Pitch the "State-by-State Benchmark Reports" to Tier 2 Hindi news portals to acquire the first round of high-quality backlinks.

### Next 90 Days (Scaling & Widgets)
- **Goal**: Establish sustainable organic traffic loops via linkable assets.
- **Action**: Deploy the "Scheme Status Tracker" widget and distribute to civic tech NGOs and local bloggers.
- **Action**: Conduct a quarterly audit of Core Web Vitals to ensure visual changes haven't regressed performance.
