import os

path = 'db/schema.ts'
content = open(path, 'r', encoding='utf-8').read()

new_tables = """
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('VIEWER'),
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
"""

if "export const users" not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write("\n" + new_tables)
    print("Added auth tables to schema.ts")
else:
    print("Auth tables already exist.")
