# Phase 6: Search Intent and Opportunity Mapping

Implementation date: 2026-10-03
Status: In progress; evidence-safe intent slice completed.

## Completed

- Added a primary intent label for each scheme pillar: `Scheme information pillar`.
- Added missing intent detection for eligibility, documents, application, and status coverage.
- Added explicit `searchEvidence: Data unavailable` to prevent unsupported keyword or traffic claims.
- Exposed intent gaps in the internal `/admin/seo` inventory table.
- Used the existing scheme fields only; no new content or URLs were generated.

## Guardrails

- Search volume, impressions, CTR, position, traffic potential, and duplicate risk remain unavailable without verified exports.
- Missing intent is a content-planning signal, not proof of search demand.
- GOBARdhan remains unreviewed and non-indexable; its missing status intent is an internal opportunity only.

## Validation

- Intent, cluster, inventory, and SEO tests: 11 passed.
- Edited-file diagnostics: no errors.
- ESLint passed for the changed implementation and test files.

## Remaining Work

- Import real Search Console query/page data for evidence-backed opportunity prioritization.
- Map queries to one primary URL and intent after the export is available.
- Create supporting pages only where standalone, source-supported content exists.