import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
if(process.env.ADMIN_MIGRATION_CONFIRM!=='apply-admin-workflow')throw new Error('Back up and verify your target database, then explicitly set ADMIN_MIGRATION_CONFIRM=apply-admin-workflow.');
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL explicitly for the intended target.');
const sql=neon(process.env.DATABASE_URL);
const source=await readFile(new URL('../drizzle/0003_admin_workflow.sql',import.meta.url),'utf8');
const statements=source.split('\n').filter(line=>!line.trim().startsWith('--')).join('\n').split(';').map(statement=>statement.trim()).filter(Boolean);
await sql.transaction(statements.map(statement=>sql.query(statement)));
console.log('Admin migration applied transactionally. Existing public scheme content was preserved.');
