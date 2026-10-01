# Indexing and URL Policy

## URL Structure
- **Base Schemes**: `/yojna/[scheme-slug]` 
  - Slugs should be concise and recognizable (e.g., `pm-kisan`, `ayushman-bharat`).
  - No trailing dates or years in slugs to maintain evergreen URLs.
- **Categorization**: Use parameterized search rather than deeply nested category paths (e.g., `/?category=kisan`). This prevents duplicate content and thin category pages from being indexed.

## Indexing Strategy
1. **Robots.txt & Meta Robots**:
   - `index, follow` on all verified scheme pages.
   - `noindex, follow` on admin pages, `/search` parameter URLs (to prevent index bloat from millions of filter combinations).
   - `noindex, nofollow` on sample/draft schemes until manually verified.

2. **Canonical Tags**:
   - Every scheme page must have a self-referencing canonical URL to prevent duplication issues from tracking parameters.

3. **Sitemap Generation**:
   - Dynamic `sitemap.xml` listing all verified, ACTIVE schemes.
   - Exclude DRAFT or `isSample: true` schemes.

## Technical SEO
- **H1 Tags**: Strictly one H1 per page containing the official scheme name.
- **Structured Data**: Implement `GovernmentService` and `FAQPage` schema on scheme pages to win rich snippets.
- **Performance**: Maintain strict Core Web Vitals (LCP < 2.5s) via Edge caching (Cloudflare) and optimized assets (Next.js Image or lightweight SVGs).
