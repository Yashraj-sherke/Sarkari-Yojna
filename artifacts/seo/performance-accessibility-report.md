# Performance and accessibility report — 30 September 2026

## Code-level changes verified

- Homepage cards use compact content and local/category visuals rather than a large image on every card.
- The former repeated moving news strip is now a static list with dates, headings and links.
- Important headings and scheme links render in server HTML.
- Pagination uses links, `aria-label`, and `aria-current`.
- Admin image previews use dimensioned `next/image` components.
- Existing skip link, semantic main regions and labeled navigation remain present.

## Validation

- ESLint: zero warnings.
- Production server crawl: exactly one H1 on each indexable sitemap page.
- Next and Vinext builds: pass.

No Lighthouse, CrUX or field Core Web Vitals score is claimed. Those require a deployed URL and representative field data.
