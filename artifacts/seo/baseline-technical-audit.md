# Baseline Technical Audit

## Initial State
- **Routes & Status Codes**: Main pages (`/`, `/yojna`, `/category/kisan`) return HTTP 200. No massive 404 blocks detected initially.
- **Search & Filters**: Client-side filtering in `components/directory.tsx` worked but heavily relied on large image downloads (images rendered for all 129 schemes simultaneously causing performance lag).
- **Metadata**: Next.js App Router metadata configured in `layout.tsx` and `seo.ts`. Title tags did not truncate abruptly but needed tuning for mobile SERPs.
- **Canonicals**: Implemented in `app/layout.tsx`.
- **Robots Directives**: Handled by `app/robots.ts` (`allow: /`, `disallow: /api/`).
- **Sitemap**: `app/sitemap.ts` correctly excludes draft and unreviewed schemes based on `isIndexableScheme` logic.
- **Structured Data**: Basic JSON-LD setup found in layout.
- **Image Payload**: LCP was severely impacted on mobile because `components/site.tsx` rendered the `OfficialImage` for every scheme card in the directory.
- **Responsive Layout**: Valid on desktop, but cards were too bulky on 360px mobile screens due to images and verbose descriptions.
- **Translation**: React state-based `lang` toggle (`lib/i18n.tsx`), no hreflang used, confirming no separate indexable URLs for translations.
- **Admin**: Protected via `lib/auth.ts` checking environment secrets.

## Classification of Initial Findings
- **P1**: (Performance/UX) Scheme images on the homepage directory drastically inflate LCP and DOM size. (Fixed in this pass by moving to SVG icons).
- **P1**: (Performance/UX) News Marquee causes unnecessary layout shifts and accessibility issues. (Fixed in this pass by converting to a static list).
- **P2**: (Content) Missing primary central scheme clusters (PM Kisan, Ayushman Bharat, PM Awas Gramin). (Fixed in this pass by sourcing and seeding data).
- **P3**: Minor ESLint warnings regarding Next.js `<img>` components in the Admin editor. (Ignored as admin-only).
