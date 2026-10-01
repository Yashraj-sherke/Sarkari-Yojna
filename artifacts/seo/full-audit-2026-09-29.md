# Full SEO and crawl audit — 29 September 2026

## Scope

This audit addresses the Semrush findings supplied in the screenshot: broken internal images, weak internal linking, broken or blocked links, title length, low-content pages, and crawlability. It checks the application source, sitemap and robots rules, rendered local pages, rendered image URLs, internal link graph, selected external links, automated tests, TypeScript, lint, and the production build.

The work improves technical crawlability and internal linking. It does not create third-party backlinks and cannot guarantee a Google ranking or traffic increase.

## Semrush baseline supplied by the owner

- 22 broken internal images
- 78 pages with a low text-to-HTML ratio
- 26 pages with long title tags
- 4 pages with a low word count
- 1 broken external link
- 28 pages with only one incoming internal link
- 18 pages blocked from crawling
- 2 external resources returning HTTP 403

## Fixes completed

- Corrected the missing `sabzi-kshetra-vistar-yojana` image extension and audited all referenced local assets.
- Added rendered-image extraction and HTTP validation to the local crawler so future audits catch broken images visible in actual HTML.
- Corrected broken internal scheme links on the certificate guide and in news data.
- Added crawlable scheme indexes to category and state pages and strengthened links among the homepage, scheme directory, category pages, guides, and reviewed scheme articles.
- Restored the editorial indexing gate: only active, non-sample schemes with an official source and `REVIEWED` publication status enter Google-facing indexes.
- Limited the sitemap to verified, indexable pages. Draft, expired, sample, source-less, and unreviewed scheme pages stay out of the sitemap and carry `noindex` where appropriate.
- Kept news pages crawlable for link discovery but marked the current unverified news records `noindex,follow`.
- Removed news database failures as a cause of homepage or sitemap HTTP 500 responses by falling back to the static news data.
- Replaced the failing MP government footer URL with the verified MPOnline government portal.
- Replaced the PIB URL that returned an authorization error with the working canonical press-release URL.
- Added breadcrumb structured data to news detail pages and shortened the certificate/news title templates.
- Added a missing admin authentication adapter using the existing ChatGPT identity headers and `ADMIN_USER_IDS` allowlist, resolving a production compilation failure without opening admin access.
- Fixed the cron environment lookup type error that blocked the production build.

## Verified local crawl result

The bounded rendered crawl covered all discoverable public pages, with a 300-page safety ceiling:

- 84 reachable public HTML pages
- 15 indexable sitemap URLs
- 49 rendered internal image URLs checked
- 0 broken internal images
- 0 network failures
- 0 crawl findings
- 0 sitemap/noindex mismatches
- 0 indexable orphan pages
- 0 duplicate canonical/title findings

Every indexable page had substantially more than one incoming internal link. The least-linked reviewed category pages had at least 18 incoming links; reviewed scheme pages had 64.

The detailed machine-readable crawl is stored at `artifacts/seo/local/latest.json`.

## Validation

- Automated suite: 31/31 passed.
- TypeScript: passed with `tsc --noEmit`.
- Focused ESLint for modified TypeScript/TSX files: passed.
- Next.js production build: passed.
- Build-time database connection failures fell back to local data; all 34 static pages generated successfully.
- Verified replacement external URLs returned HTTP 200 during the audit.

## Intentional crawl exclusions

Semrush may continue to report some blocked URLs because `/api/`, `/out/`, and private admin routes are deliberately excluded or marked `noindex`. These endpoints should not appear in Google results. Removing these protections would expose private or utility routes without improving useful search coverage.

The large set of thin scheme records was not padded with generated text. Unreviewed records remain outside the sitemap until their facts, official source, and publication status are reviewed. This prevents low-quality or unsupported government-scheme information from being indexed.

## Deployment and follow-up

These results describe the corrected local application. After deployment, rerun Semrush and request validation in Google Search Console. The production crawler cannot reflect the fixes until the updated build is published and recrawled.
