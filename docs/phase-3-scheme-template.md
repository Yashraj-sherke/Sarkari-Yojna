# Phase 3: Master Scheme Template

Implementation date: 2026-10-03
Status: In progress; shared structure slice completed.

## Completed

- Preserved the reusable `YojnaDetailClient` data-driven scheme layout.
- Enforced the required content order after the scheme header: hero image, quick facts, then table of contents.
- Activated the existing `SchemeQuickFacts` component for every scheme page rather than adding scheme-specific markup.
- Restored explicit `robots.index` decisions for scheme, category, and state metadata.
- Restored sitemap filtering through `isIndexableScheme`.
- Added regression coverage for the template order and indexing contract.

## Validation

- Focused SEO tests: 8 passed.
- Scheme template regression tests: 2 passed.
- Edited-file diagnostics: no errors.
- Edited-file ESLint: passed.

## Remaining Phase 3 Work

- Add a data-backed latest-update model/box rather than deriving current claims from arbitrary text.
- Evaluate the desktop sidebar placement against the required scheme navigation after a rendered visual check.
- Migrate and verify PM Kisan, Ladli Behna, and the restored GOBARdhan slug with reviewed source data.
- Keep the GOBARdhan noindex/not-found blocker open until its stable slug and editorial review are restored.