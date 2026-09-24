# Google brand-result follow-up — 24 September 2026

This report supersedes the earlier audit's recommendation to use Setu as the primary brand. The supplied master brief explicitly prefers **Sarkari Yojana**, with Sarkari Yojana Setu as an alternate/domain identity.

## A. Critical blockers
No new homepage noindex or robots block was found. Changes are local, not deployed. Production retrieval through the research browser failed, so the pasted Google result is user-provided evidence, not a verified live reproduction. Do not describe the whole project as technically ready: the dynamic missing-route HTTP status limitation remains.

## B. High-priority findings
- Homepage H1 was a slogan; the connection between the primary brand and the searched domain was not explicit.
- WebSite markup had no alternate names or publisher identity reference.
- Primary brand strings differed between shared configuration, translated labels, policy pages and scheme publisher markup.
- An environment variable could send canonical/social identity to a different host.
- About/Contact appearing for a brand query does not prove the homepage is unindexed. Search Console URL Inspection is needed to distinguish indexing from result selection.

## C. Implemented
- Homepage title, H1, description and social metadata explicitly identify Sarkari Yojana and its purpose.
- Visible homepage and About text explain Sarkari Yojana Setu / sarkariyojanasetu.com as alternate identity, independent ownership and actual current coverage (Central + MP).
- Added visible search, eligibility, state and category navigation using existing controls/routes.
- One homepage WebSite node with name, alternateName, canonical URL, language, stable ID and publisher reference; matching Organization identity. Policy-page WebSite references and scheme publishers agree.
- Primary brand normalized in layout metadata, footer constants, accessible logo text, translations and manifest. Existing indexed paths remain unchanged.
- Public SEO origin fixed to https://www.sarkariyojanasetu.com.
- About, Contact and Privacy remain indexable. No keyword pages, fabricated affiliation, unrelated PM-SETU content or association with the Blogger result added.

## D. Files changed in this follow-up
- app/page.tsx; app/layout.tsx; app/yojna/[slug]/page.tsx
- components/directory.tsx; components/site.tsx; components/information-page.tsx; components/yojna-detail-client.tsx
- lib/config.ts; lib/i18n.tsx; lib/information-pages.ts
- public/manifest.webmanifest; tests/seo-http.mjs

## E–H. Validation and measurements
- Next production build including TypeScript: PASS.
- Focused implementation lint and HTTP-test lint: PASS. A separate check of lib/i18n.tsx reports its existing setState-in-effect error at line 413 in language preference hydration; this pass changed brand strings only and leaves that behavior intact. Full lint is therefore not clean.
- SEO + scheme-content regression tests: 10/10 PASS.
- Local production HTTP suite: PASS, 14 sitemap URLs with canonical/indexing checks, robots, JSON-LD parsing, breadcrumbs, discovery links and central redirect. Added assertions verify homepage H1/title/og:site_name, primary/alternate names, and linked WebSite/Organization IDs.
- Missing dynamic pages still stream HTTP 200 with noindex; test reports this limitation explicitly.
- Site-name markup is not supported by Google's Rich Results Test. Use Schema Markup Validator and Search Console URL Inspection for production checks.
- No Lighthouse, field CWV, security audit or visual accessibility measurements were performed in this focused brand fix. No performance gain claimed.
- Vinext/Cloudflare production build: PASS.

## I–J. Editorial work and risks
The previous catalogue review remains: 151 of 153 seeded records require editorial review. Scheme facts and verification dates were not changed. A descriptive/generic primary name such as Sarkari Yojana may not be selected by Google's site-name system; alternate identity and consistent visible wording express a preference, not a guarantee. Search result ordering, spelling corrections, AI Overviews and unrelated Blogger results cannot be directly controlled by metadata.

## K. Post-deployment Search Console checklist
1. Deploy the tested changes using the existing hosting workflow.
2. In the verified domain property for sarkariyojanasetu.com, inspect https://www.sarkariyojanasetu.com/ and run Test Live URL.
3. Verify HTTP access, rendered brand/H1/WebSite markup, indexability, and both user-declared and Google-selected canonical. Investigate indexing exclusion reasons if present.
4. Request indexing of the homepage once; optionally inspect the updated About page. Repeated requests do not accelerate crawling.
5. Submit/confirm https://www.sarkariyojanasetu.com/sitemap.xml.
6. Validate deployed structured data with Schema Markup Validator for site names and Rich Results Test for supported article/breadcrumb features.
7. Review www/apex and HTTP/HTTPS redirects, missing-page responses, and mobile rendering on the actual Cloudflare runtime.
8. Track queries sarkariyojanasetu, sarkari yojana setu and sarkari yojana in Search Console. Compare which landing pages receive impressions/clicks after recrawl; do not infer success from one personalized search result.

## Official guidance consulted
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
