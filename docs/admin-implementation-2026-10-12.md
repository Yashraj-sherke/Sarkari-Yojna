# Sarkari Yojana Setu admin implementation — 12 October 2026

## Authorized scope

Local source edits, migration files, isolated test records, dependency updates and builds. No production migration, real scheme verification, real content publication, deployment, Search Console submission or social publishing is authorized or performed by this work.

## Architecture and routes

The existing Next.js / React / TypeScript application, Neon PostgreSQL and Drizzle contract are retained. Next and Vinext/Cloudflare builds remain supported. No Prisma migration or replacement database was introduced.

- `/admin-login`: local password login, with optional trusted proxy authentication explicitly configured.
- `/admin`: real database dashboard; setup error replaces fake statistics if the DB/migration is missing.
- `/admin/schemes`: SQL search, pagination, sort, category/state/status/editorial filters, selected JSON exports.
- `/admin/schemes/new`, `/admin/schemes/edit/[slug]`: sectioned scheme editor, structured eligibility rules, arrays, source references, translations, canonical JSON, unsaved public-component preview.
- `/admin/import`: pasted/uploaded JSON, strict nested validation, draft reset, conflict selection, before/after diff and explicit import confirmation.
- `/admin/schemes/edit/[slug]/history`: saved revisions and restore to working draft.
- `/admin/news`, `/admin/news/edit/new`, `/admin/news/edit/[slug]`: separate news drafts and explicit review/publish workflow.
- `/admin/users`: protected user creation, roles, activation/deactivation and credential reset.
- `/admin/activity`: persisted scheme, news, export and settings events.
- `/admin/settings`: approved official-host restrictions; existing categories/state identifiers are displayed without renaming public URLs.
- Existing SEO, quality and source-history pages remain.

## Phases

### 1. Authentication and integrity

Issue: one allowlisted role, proxy headers implicitly trusted, plain SHA-256 password helper, save automatically refreshed verification dates.

Changes: local PBKDF2-SHA256 with independent random salts and 600,000 iterations; 12–200 character passwords; random 256-bit sessions stored as hashes, HttpOnly/SameSite Strict cookies, HTTPS Secure cookies and eight-hour expiry. Roles are checked against the database on every request, so disabled users and changed permissions take effect immediately. Login has atomic per-email attempt limits. Proxy authentication is disabled unless `TRUST_CHATGPT_PROXY=true`; the deployment must strip client-supplied identity headers. Known old SHA password hashes are rejected, never silently reused. Password resets revoke sessions.

Server authorization runs in layouts and every administrative API. JSON mutations require same-origin and JSON content type, have a 30 KB payload limit and strict field validation. The last active Super Admin is protected; a logged-in user cannot change their own role or deactivate themselves. Scheme save no longer invents verification timestamps.

### 2. Draft and publication separation

Issue: directly editing the public record exposed unfinished changes and lacked an explicit publication state machine.

Changes: `cms_drafts` stores separate working content, numeric version and review state. Existing public `schemes` rows are preserved. A legacy article opens as version zero; saving establishes a draft without changing its public URL or published content. Draft → In Review → Reviewed → Published requires distinct authorized actions. Editors create/edit/submit; Reviewers approve/return; Super Admins publish and manage users/settings. A later edit resets review evidence. In-review edits are locked. Archive preserves the existing public article URL and marks it archived; explicit unpublish hides the public record while retaining revision history. Restore starts an unverified draft.

Review requires all factual checks, substantive notes, dated source references and completed content. Passing URL validation is not treated as factual verification. Evidence records the actor and actual action time. Published CMS snapshots are authoritative even for slugs with legacy static corrections; database-specific cache namespaces prevent cross-environment reuse. Publication copies only the reviewed revision, omits private research notes, and expires public cache tags and relevant routes. Version checks, database writes and history are atomic SQL statements, so stale edits fail with 409 and failed writes do not leave success-only audit events.

### 3. Editor, import/export and news

The established `Scheme` schema remains authoritative, including `rules`, `steps`, `verifiedAt`, `nextReviewAt`, `references`, translations and SEO fields. Unknown top-level and nested import properties generate errors rather than being silently dropped. Import cannot elevate verification or publishing privileges. Missing eligibility or application facts must be researched; the system does not fabricate them.

HTML is sanitized in public scheme and news renderers. Preview uses current scheme form data and suppresses sharing, saved-scheme and feedback actions. News supports official source, source verification date, what changed, affected citizens and related scheme slugs before review/publication. Unpublished database news overrides matching static fallback news rather than silently reappearing.

The fake AI extraction endpoint is removed. The existing Gemini draft integration is retained behind permissions, size/schema validation and usage limits; it requires GEMINI_API_KEY and was not called in this implementation. Missing fields are not filled with invented documents or official links. Persistent image uploads return an explicit unavailable response. Existing hosted image URLs can be supplied. Local filesystem upload is not a production storage integration.

### 4. Validation and build

Actual commands and results are recorded in `artifacts/admin/` and the final implementation report. Isolated integration testing uses in-memory PostgreSQL through PGlite and a Neon HTTP adapter; synthetic `.test` accounts and synthetic schemes never reach the production database. The test preload refuses to run without `ADMIN_TEST_DATABASE=isolated` and overrides the database URL before Next loads configuration.

## Setup in Windows PowerShell

Read `.env.admin.example`; copy placeholder configuration into the intended environment's secret store. Do not commit passwords or the database URL. Back up and verify the target database before applying the additive migration.

```powershell
# DATABASE_URL must point to your explicitly selected local/staging target.
$env:ADMIN_MIGRATION_CONFIRM = 'apply-admin-workflow'
node scripts/admin-migrate.mjs
Remove-Item Env:ADMIN_MIGRATION_CONFIRM

$env:BOOTSTRAP_ADMIN_EMAIL = 'your-admin-address@example.com'
$env:BOOTSTRAP_ADMIN_PASSWORD = Read-Host 'New admin password' -MaskInput
node --import tsx scripts/admin-bootstrap.ts
Remove-Item Env:BOOTSTRAP_ADMIN_EMAIL
Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD

npm run dev:next
# Open /admin-login and sign in with the account you just created.
```

The bootstrap refuses to create another administrator if an active Super Admin already exists. Existing legacy role values are not silently elevated; an operator must explicitly review existing user identities and assign supported roles through an authorized recovery/migration process. No default production account or password ships.

```powershell
npm run typecheck
npm run test
npm run build
node scripts/admin-integration.mjs
npm run build:cf
```

If disk space is limited, the Next webpack build supports `$env:BUILD_NO_CACHE = 'true'`; clear that environment setting afterward. Start a production Next build with `node node_modules/next/dist/bin/next start --port 3100`. Cloudflare deployment uses the existing `deploy:cf` command only after its secrets, database migration, authentication and backups are configured and deployment is authorized.

## Remaining integrations and practical limits

- Real production accounts, migrations, secrets, live hosting identity, backups and recovery drills require operator setup; local tests do not establish production deployment correctness.
- Email-based password recovery, notifications and persistent image storage are unconnected. Automatic source verification is not implemented; the existing AI draft provider remains configurable and every generated draft still requires human review. Super Admin credential reset is available.
- Categories and states are shared controlled identifiers; arbitrary taxonomy renaming/deletion is deliberately not exposed because it can break existing routes.
- Bulk JSON export is available; imports process one canonical scheme object at a time. Individual unsaved JSON downloads are local previews; saved selected-record exports are audited server-side.
- SQL pagination is implemented for schemes, users and activity. News listing currently shows up to 100 records; larger news catalogues need pagination before scaling beyond this limit.
- No permanent deletion or bulk destructive operation is exposed. Archive retains records/history.
- Imported HTML styling is restricted for security; source text is retained in canonical draft data.
- The additive SQL migration is applied by the explicit migration script; it is not silently applied during startup.
- Database rollout and Google indexing/ranking are separate from implementation completion.




## Final validation — 13 October 2026

- Next.js 16.4.0 production build passed in the original repository with `BUILD_NO_CACHE=true` and `BUILD_LOW_MEMORY=true`.
- Cloudflare/Vinext production build passed in `D:\codex-builds\sarkari-admin-20261013`. A source hash comparison found no differences in app/components/lib/db/drizzle/scripts/tests/build/vendor source files. The temporary copy excluded production .env and .dev.vars secrets. Physical dependencies were copied because cross-drive dependency junctions are incompatible with Next's Windows resolver.
- 17 unit/security/SEO tests passed. 22 isolated PostgreSQL HTTP integration checks passed, including actual password login, cookie sessions, drafts, optimistic conflicts, permissions, review evidence, publication/cache refresh, canonical exports, duplicate drafts, news revisions/unpublish, user/session revocation and existing-slug CMS authority.
- Lint passed with zero errors and three pre-existing image optimization warnings. Standalone TypeScript passed using `npm run typecheck`.
- Vinext replaces `.next/types/routes.d.ts`; `typecheck` now runs `next typegen` before TypeScript so the two runtimes do not leave incompatible generated declarations.
- Production dependency audit reported zero advisories after updating Next/eslint-config-next to 16.4.0, source-map-js and a compatible ws 8.21.0 override. This refers to `npm audit --omit=dev`, not a claim about every development tool.
- Browser QA verified editor login, JSON validation/confirmation/import, Hindi state labels, current unsaved values, private article/application-step preview, mobile preview, hidden draft sharing controls and no editor publish control. Browser console errors were empty. Synthetic test records/accounts were isolated and were never published to the real website.

Evidence: `artifacts/admin/final-validation.json`, `integration.json`, `browser-qa.json`, `browser-preview.png`; dependency audit: `artifacts/admin-dependency-audit.json`.

The isolated local preview is at `http://127.0.0.1:3218/admin-login`; its memory-only test database resets when the preview server restarts. These accounts are test fixtures, not production defaults. Create your actual administrator using the documented bootstrap after configuring/migrating the selected database.

No production database migration, deployment, actual article publication, Search Console submission or social publishing was performed. Email recovery, notifications and persistent upload storage remain setup-dependent. Gemini draft-provider calls were not exercised; its outputs remain unverified drafts and require complete human review before publication.

For low-memory machines, set `BUILD_LOW_MEMORY=true` to use two Next build workers. If C: fills again, free disk space before rebuilding or use the existing D: validation copy. Existing scheme facts and legacy news were not comprehensively re-researched during this admin implementation.
