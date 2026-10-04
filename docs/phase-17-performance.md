# Phase 17: Performance

Implementation date: 2026-10-03
Status: Focused performance slice completed.

## Completed

- Removed the global homepage hero-image preload from the root layout.
- Prevented non-homepage routes from assigning high-priority network work to a homepage-only asset.
- Confirmed scheme hero images reserve dimensions through `OfficialImage` aspect ratios and explicit image dimensions.

## Validation

- Performance, schema, trust, mobile, template, and SEO tests: 12 passed.
- Edited-file diagnostics: no errors.

## Remaining Work

- Run production-equivalent Lighthouse/CrUX checks.
- Measure JavaScript bundle and third-party analytics cost.
- Capture mobile CLS/LCP on homepage, scheme detail, news detail, and directory routes.