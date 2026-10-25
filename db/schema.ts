import { pgTable, text, integer, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';
export const posts=pgTable('schemes',{slug:text('slug').primaryKey(),type:text('type').notNull().default('scheme'),data:text('data').notNull(),status:text('status').notNull(),nextReviewAt:text('next_review_at'),updatedAt:text('updated_at').notNull()});
export const sessions=pgTable('sessions',{id:text('id').primaryKey(),expiresAt:text('expires_at').notNull()});
export const reports=pgTable('reports',{id:text('id').primaryKey(),slug:text('slug').notNull().references(()=>posts.slug),reason:text('reason').notNull(),detail:text('detail').notNull(),status:text('status').notNull().default('open'),createdAt:text('created_at').notNull()});
export const reminders=pgTable('reminders',{id:text('id').primaryKey(),sessionId:text('session_id').notNull().references(()=>sessions.id,{onDelete:'cascade'}),slug:text('slug').notNull().references(()=>posts.slug),date:text('date').notNull(),createdAt:text('created_at').notNull()});
export const signals=pgTable('signals',{sessionId:text('session_id').notNull().references(()=>sessions.id,{onDelete:'cascade'}),slug:text('slug').notNull().references(()=>posts.slug)},(t: any)=>[primaryKey({columns:[t.sessionId,t.slug]})]);
export const verificationLogs=pgTable('verification_logs',{id:text('id').primaryKey(),slug:text('slug').notNull(),actor:text('actor').notNull(),source:text('source').notNull(),changes:text('changes').notNull(),createdAt:text('created_at').notNull()});
export const rateLimits=pgTable('rate_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});
export const events=pgTable('events',{day:text('day').notNull(),name:text('name').notNull(),count:integer('count').notNull()},(t: any)=>[primaryKey({columns:[t.day,t.name]})]);


export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('VIEWER'),
  active: boolean('active').notNull().default(true),
  createdAt: text('created_at').notNull()
});

export const adminSessions = pgTable('admin_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull()
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  targetId: text('target_id'),
  changes: text('changes'),
  createdAt: text('created_at').notNull()
});

export const samachar = pgTable('samachar', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  sourceUrl: text('source_url'),
  changes: text('changes'),
  affected: text('affected'),
  schemeSlugs: jsonb('scheme_slugs'),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  body: text('body').notNull(), // Stored as JSON string array of paragraphs
  status: text('status').notNull().default('DRAFT'), // DRAFT, PUBLISHED
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const cmsDrafts=pgTable('cms_drafts',{slug:text('slug').primaryKey(),data:text('data').notNull(),workflow:text('workflow').notNull().default('DRAFT'),version:integer('version').notNull().default(1),updatedAt:text('updated_at').notNull(),updatedBy:text('updated_by').notNull(),reviewNote:text('review_note'),reviewedBy:text('reviewed_by'),reviewedAt:text('reviewed_at')});
export const cmsHistory=pgTable('cms_history',{id:text('id').primaryKey(),slug:text('slug').notNull(),version:integer('version').notNull(),actor:text('actor').notNull(),action:text('action').notNull(),data:text('data').notNull(),note:text('note').notNull(),createdAt:text('created_at').notNull()});
export const cmsSettings=pgTable('cms_settings',{key:text('key').primaryKey(),value:text('value').notNull()});
export const cmsNewsDrafts=pgTable('cms_news_drafts',{slug:text('slug').primaryKey(),data:text('data').notNull(),version:integer('version').notNull().default(1),workflow:text('workflow').notNull().default('DRAFT'),updatedAt:text('updated_at').notNull(),updatedBy:text('updated_by').notNull(),reviewedAt:text('reviewed_at'),reviewedBy:text('reviewed_by'),reviewNote:text('review_note')});
