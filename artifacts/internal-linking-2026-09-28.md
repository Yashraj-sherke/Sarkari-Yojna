# Google check and internal linking — 28 September 2026

## Manual observations

Opened Google in the browser with `site:sarkariyojanasetu.com`. Google displayed seven results: the homepage, Privacy, About, Contact, Terms, Disclaimer, and PM-KISAN. Google also offered to include omitted similar results. This is a search-result sample, not a complete index count or ranking/traffic measurement. Search Console was not accessed.

The live HTTPS homepage loaded and showed working navigation destinations for categories, scheme articles, the scheme directory, and guides. Google displayed an older homepage title than the current live title; this alone does not establish a canonical or redirect problem.

## Local changes

- Guide pages now link directly to up to six relevant reviewed, indexable scheme articles, plus the other preparation guides and the full scheme directory.
- Scheme-to-guide and guide-to-scheme navigation share relevance rules based on existing document names and the food category. The income-certificate guide no longer sends everyone to the education category.
- The scheme directory links to categories containing reviewed articles and to each preparation guide.
- About now links contextually to the scheme directory and guide collection.
- Links use Next Link with real hrefs and descriptive text. Existing review/noindex restrictions are unchanged. The previously disabled homepage SchemeIndex stays disabled.

These are internal links, not external backlinks. No external posts, directory submissions, or messages were sent. No scheme facts or verification dates were changed.

## Validation

- Focused ESLint: passed for all five changed source files.
- Relevance checks: passed. With the current seed data, the ration guide links to ration-support, the safety guide links to pm-kisan and ration-support, and the income guide does not invent a match.
- Existing SEO/content tests: 9/10 passed. The failure is the existing fixed catalogue-count assertion (expected 153, actual 154).
- Full TypeScript check: blocked by errors outside these changes, including admin API typing, server environment types, and the homepage latestNews prop.
- Production build: compilation passed; type validation failed on generated route types (`AppRoutes` missing from `.next/types/routes.js`). No deployment performed.
- Local HTTP checks: all five changed routes returned 200; all 16 expected link occurrences were present in server-rendered HTML. Database reads failed in this local environment, so these checks exercised the existing seed fallback, not production database content.
- Whitespace check for changed source files: passed. Other files are being edited in this shared workspace and are outside this change.

## Follow-through

Publish only after the current project build is fixed and checked. Then confirm the new links in deployed HTML, submit/confirm the existing sitemap in Search Console, and inspect priority articles. Track impressions and clicks after recrawl; no traffic increase has been measured or promised.

Google's guidance: https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Competitor follow-up

The user clarified that the requested backlinks mean links to different yojanas within this website.

Inspected https://sarkariyojana.com/, its /madhya-pradesh/ collection, and /pm-surya-ghar-muft-bijli-yojana/ article. Observed state/ministry navigation, direct article lists, descriptive task-oriented titles, and article section navigation. These are observable design patterns; no claim is made about their rankings, traffic, backlink totals, or the cause of their search performance. Competitor scheme claims were not used as verified facts or copied.

Added a compact, server-rendered reviewed-article index to category/state collections through the existing SchemeIndex component. It omits empty collections and excludes unreviewed/expired records. Kept the previously removed large homepage index absent; added contextual directory and guide links near homepage search instead. Existing guide/article cross-links from the earlier pass remain.

Validation: focused lint and three SEO regression tests passed. Local HTTP checks passed for the homepage, farmer and food categories, safety guide, and ration guide. The new food-category index was also confirmed in the browser. These checks use local seed fallback data; they do not establish production database or deployment success. The earlier full-build blockers remain unresolved by this navigation-only follow-up. No deployment performed.
