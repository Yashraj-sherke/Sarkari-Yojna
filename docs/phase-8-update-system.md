# Phase 8: Controlled Updates and News Links

Implementation date: 2026-10-03
Status: In progress; verified update-to-pillar linking slice completed.

## Completed

- Added explicit extraction of internal `/yojna/...` links already present in news body content.
- Added reviewed scheme links to update detail pages.
- Added up to three matching update links to scheme pillar pages.
- Reused the existing cluster-links surface for pillar-to-update navigation.
- Kept external URLs and unrelated text out of the relationship model.

## Guardrails

- No scheme relation is inferred from title similarity.
- No new update pages or factual claims were created.
- Only reviewed schemes appear as update-to-pillar links.
- Existing update dates and source content remain unchanged.

## Validation

- Update, cluster, template, and SEO tests: 12 passed.
- Edited-file diagnostics: no errors.
- Edited-file ESLint: passed.

## Remaining Work

- Add explicit structured scheme relation fields to database news records when editorial tooling supports them.
- Add update dates/source references to the admin inventory.
- Review current news claims under the scheme-research workflow before treating updates as authoritative.