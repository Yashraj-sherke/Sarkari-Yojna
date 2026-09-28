# Implementation Plan: Sarkari Yojana Admin CMS + Verification Platform

## 1. Current Architecture Audit
The current Sarkari Yojana platform is a Next.js 16 application using:
- **Framework:** Next.js (App Router)
- **Database:** Neon Serverless PostgreSQL with Drizzle ORM
- **Current DB Schema (`db/schema.ts`):** 
  - Uses a document-store approach via the `posts` table (slug, type, data, status). The `data` field stores the scheme JSON.
  - Contains supporting tables like `verification_logs`, `reports`, `reminders`, etc.
- **Styling:** Tailwind CSS + Shadcn UI components.
- **Goal Alignment:** The goal is to build an authenticated CMS *without* rewriting the public-facing UI or reinventing the database if not necessary. We will augment the current `posts` structure and introduce RBAC and advanced verification schemas.

---

## Phase 1: Admin Authentication & Dashboard
**Objective:** Secure the `/admin` routes and build the high-level dashboard.
- **Database Changes:** 
  - Create a `users` table (id, email, password_hash, role).
  - Create a `roles` enum: `SUPER_ADMIN`, `EDITOR`, `REVIEWER`, `PUBLISHER`, `VIEWER`.
- **Route Protection:** 
  - Implement Next.js Middleware or server-side layout checks to protect all `/admin/*` routes.
- **Dashboard UI:**
  - Create `/admin/page.tsx` displaying statistics (Total Schemes, Drafts, Needs Verification, etc.) by querying the `posts` table grouped by `status`.

## Phase 2: Scheme CRUD & Database Integration
**Objective:** Build the core editorial interface.
- **Database Adaptation:** 
  - Augment the `data` JSON schema in the `posts` table to support the extended fields required (objective, benefits, eligibility, etc.). 
  - Map the required statuses (`DISCOVERED`, `DRAFT`, `NEEDS_SOURCE`, `FACT_CHECK`, `VERIFIED`, `PUBLISHED`, `UPDATE_REQUIRED`, `CLOSED`, `ARCHIVED`) to the `status` column.
- **Editor UI:** 
  - Build a React-Hook-Form + Zod based editor in `/admin/schemes/edit/[slug]` that allows editing all basic information, categories, and tags.

## Phase 3: Draft, Review, & Publish Workflow
**Objective:** Prevent accidental publishing and enforce the review lifecycle.
- **State Machine:** 
  - Create server actions that transition a scheme's status (e.g., `Submit for Review`, `Approve`, `Publish`).
- **AI Drafting Assistant:** 
  - Integrate AI tools to generate draft JSON payloads based on provided text. 
  - Ensure the AI server action *forces* the resulting status to `DRAFT` or `FACT_CHECK`.
- **Public Protection:** 
  - Ensure the public website (`app/yojna/[slug]/page.tsx`) explicitly filters for `status === 'PUBLISHED'` only.

## Phase 4: Sources & Field-Level Evidence
**Objective:** Attach verified sources to specific facts.
- **Database Changes:** 
  - Create a `source_registry` table (url, title, type, date).
  - Update the `data` JSON schema to support an `evidence` array on critical fields (e.g., `eligibility_evidence`, `benefits_evidence`).
- **Admin UI:** 
  - Add an "Evidence" panel in the editor where editors can link official URLs to specific fields. 
  - Block the `VERIFIED` status transition if critical fields lack evidence.

## Phase 5: Version History & Change Detection
**Objective:** Maintain audit trails and diffs.
- **Database Changes:** 
  - Create a `scheme_versions` table storing snapshots of the `data` payload before any update.
- **Version UI:** 
  - Build a `/admin/schemes/[slug]/history` view to render a diff of changes between versions and allow rollbacks.
- **Change Detection:** 
  - Create background jobs (or manual triggers) that ping official source URLs to detect changes, flipping the status to `UPDATE_REQUIRED`.

## Phase 6: SEO, Image, & Content Management
**Objective:** Granular control over SEO and assets.
- **Editor Enhancements:** 
  - Add SEO fields (canonical, meta description, OG tags) to the editor.
- **Image Management:** 
  - Create a simple media upload component referencing the `public/images` directory or an external bucket.
- **Closed Schemes:** 
  - Add UI toggles to mark a scheme as `CLOSED` and input the official closure reason, retaining its indexability based on admin choice.

## Phase 7: Public Website Integration & Revalidation
**Objective:** Connect the CMS to the live site smoothly.
- **Revalidation:** 
  - Implement `revalidatePath` and `revalidateTag` in the publishing server actions to clear Next.js caches automatically when a scheme goes live.
- **Sitemap & Structured Data:** 
  - Dynamically generate the sitemap and `FAQPage`/`Article` JSON-LD from the published database records.

## Phase 8: Security, Tests, & Production Audit
**Objective:** Ensure enterprise-grade stability.
- **Security Audit:** 
  - Ensure zero sensitive keys are exposed to the client. Validate all RBAC checks server-side.
- **Testing:** 
  - Write tests verifying that drafts are completely inaccessible via public routes.
- **Final Deployment:** 
  - Ensure all database migrations run successfully and environment variables are documented.
