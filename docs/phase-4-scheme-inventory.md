# Phase 4: Scheme Inventory and Classification

Implementation date: 2026-10-03
Status: In progress; internal inventory slice completed.

## Completed

- Extended the existing SEO Health abstraction with a structured scheme inventory.
- Added category, state, status, indexability, official-source presence, priority, latest known review/update, content depth, and available intent fields.
- Added conservative internal classifications:
  - `A`: priority pillar candidate
  - `C`: state-specific scheme opportunity
  - `F`: needs major improvement before publication
  - `H`: lower-priority existing record
- Added the inventory table to the internal `/admin/seo` dashboard.
- Kept search demand, duplicate risk, traffic metrics, and related-scheme evidence as unavailable until verified data is imported.

## Validation

- Inventory and SEO tests: 9 passed.
- Edited-file diagnostics: no errors.
- Edited-file ESLint: passed.

## Remaining Phase 4 Work

- Import a reviewed database export to classify the full production inventory.
- Add explicit pillar/supporting-page fields when the supporting-intent architecture is approved.
- Resolve duplicate candidates manually; the current inventory does not infer merges from text similarity.
- Map official sources and latest substantive updates for records missing evidence.