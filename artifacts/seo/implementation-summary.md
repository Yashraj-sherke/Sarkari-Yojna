# Implementation summary — 30 September 2026

## Implemented

- Separated editorial/indexing checks through the existing `isIndexableScheme` gate and validation tests.
- Kept only reviewed, sourced, non-sample records in the sitemap.
- Added a public verification/status directory and CSV endpoint already present in this working tree.
- Made directory pagination use real URLs and server-provided page state. Page one uses `/yojna`; later pages use `?page=N` and self-canonical metadata.
- Restored server-rendered homepage and directory headings by removing the `useSearchParams` client-rendering bailout.
- Added a server-rendered reviewed-scheme index to `/yojna` so every sitemap scheme is directly discoverable.
- Enforced admin allowlisting in `proxy.ts`; unauthenticated requests return a real 307 to `/admin-login` with `X-Robots-Tag: noindex, nofollow`.
- Added the missing `/admin-login` page and removed all current lint warnings.

## Verified locally

- `npm run lint`: pass, zero warnings.
- `npx tsc --noEmit`: pass after `next typegen` refreshed generated route types.
- `npm run test`: 31/31 pass.
- `npm run test:seo`: 14/14 pass against a fresh production server.
- `npm run build`: pass, 37 static/dynamic routes reported.
- `npm run build:cf`: pass with Vinext 1.0.0-beta.5.

No deployment or live database write was performed.
