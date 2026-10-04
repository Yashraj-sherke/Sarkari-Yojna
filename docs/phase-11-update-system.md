# Phase 11: News and Update System

Implementation date: 2026-10-03
Status: Partially complete; technical evidence gate implemented.

## Completed

- Preserved structured `changes`, `affected`, `sourceUrl`, and optional `schemeSlugs` fields from database news rows.
- Added `samacharQuality` checks for headline, summary, body, date, change summary, affected audience, official source, and scheme-pillar link.
- Made news detail metadata explicitly indexable only when the evidence gate passes.
- Made the news index metadata explicitly indexable.
- Added only quality-passing updates to the sitemap.
- Added an update evidence queue to `/admin/seo`.
- Kept update-to-pillar and pillar-to-update links bidirectional.

## Current Data Status

Existing static updates are currently held from the sitemap when structured change, affected-audience, or source fields are missing. This is intentional: the system does not infer those facts from article prose.

## Validation

- Phase 11, cluster, inventory, content, and SEO tests: 16 passed.
- Edited-file diagnostics: no errors.
- ESLint passed for implementation files; the test file is ignored by the repository ESLint configuration.

## Remaining Work

- Complete evidence fields for each update through editorial review.
- Add database migration support for structured scheme relations if the news table does not yet contain `scheme_slugs`.
- Add source/update review fields to the news editor UI.
- Re-run production sitemap and URL checks after reviewed updates are published.