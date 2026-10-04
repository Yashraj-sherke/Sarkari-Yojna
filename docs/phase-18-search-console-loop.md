# Phase 18: Search Console Data Loop

Implementation date: 2026-10-03
Status: Opportunity pipeline implemented; real query/page export pending.

## Completed

- Added a validated Search Console query/page row model.
- Added position 4-20 opportunity filtering based on actual impressions and positions.
- Added an opportunity queue to `/admin/seo`.
- Kept aggregate baseline metrics separate from query/page opportunity evidence.
- Displays `Data unavailable` when no query/page export is present.

## Guardrails

- No search volume, ranking probability, traffic estimate, or CTR conclusion is fabricated.
- Rows outside the position 4-20 opportunity filter are not promoted.
- The current baseline remains labeled as user-supplied and insufficient for trend conclusions.

## Validation

- Search Console, schema, mobile, template, inventory, and SEO tests: 20 passed.
- Edited-file diagnostics: no errors.
- ESLint passed for the implementation and tests.

## Remaining Work

- Import a real Search Console query/page export.
- Add longer periods and page/query dimensions before prioritizing edits.
- Add URL Inspection and sitemap status evidence to the same reporting surface.