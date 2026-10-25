-- Apply manually after backup; no public scheme content is modified by this migration.
ALTER TABLE users ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
CREATE TABLE IF NOT EXISTS cms_drafts (
 slug text PRIMARY KEY, data text NOT NULL, workflow text NOT NULL DEFAULT 'DRAFT',
 version integer NOT NULL DEFAULT 1, updated_at text NOT NULL, updated_by text NOT NULL,
 review_note text, reviewed_by text, reviewed_at text
);
CREATE TABLE IF NOT EXISTS cms_history (
 id text PRIMARY KEY, slug text NOT NULL, version integer NOT NULL, actor text NOT NULL,
 action text NOT NULL, data text NOT NULL, note text NOT NULL, created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS cms_history_slug_date ON cms_history(slug, created_at DESC);
CREATE INDEX IF NOT EXISTS cms_drafts_workflow_date ON cms_drafts(workflow, updated_at DESC);
CREATE INDEX IF NOT EXISTS schemes_category ON schemes ((data::jsonb->>'category'));
CREATE INDEX IF NOT EXISTS schemes_state ON schemes ((data::jsonb->>'state'));
CREATE TABLE IF NOT EXISTS cms_settings (key text PRIMARY KEY, value text NOT NULL);
CREATE TABLE IF NOT EXISTS cms_news_drafts (
 slug text PRIMARY KEY, data text NOT NULL, version integer NOT NULL DEFAULT 1,
 updated_at text NOT NULL, updated_by text NOT NULL, reviewed_at text, reviewed_by text, review_note text,
 workflow text NOT NULL DEFAULT 'DRAFT'
);
ALTER TABLE samachar ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE samachar ADD COLUMN IF NOT EXISTS changes text;
ALTER TABLE samachar ADD COLUMN IF NOT EXISTS affected text;
ALTER TABLE samachar ADD COLUMN IF NOT EXISTS scheme_slugs jsonb;
