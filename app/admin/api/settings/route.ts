import { z } from 'zod';
import { requirePermission } from '@/lib/admin-auth';
import { database } from '@/lib/admin-cms';
import { checkOrigin,readBody,json,failure } from '@/lib/server';
const schema=z.object({sourceDomains:z.array(z.string().regex(/^(?:[a-z0-9-]+\.)+(?:gov|nic)\.in$/)).max(100)}).strict();
export async function GET(){try{await requirePermission('settings');const sql=database();const rows=await sql`SELECT value FROM cms_settings WHERE key='sourceDomains'`;return json({sourceDomains:rows.length?JSON.parse(rows[0].value):[]});}catch(error){return failure(error);}}
export async function POST(req:Request){try{checkOrigin(req);const user=await requirePermission('settings');const body=schema.parse(await readBody(req));const sql=database();const now=new Date().toISOString();await sql.transaction([sql`INSERT INTO cms_settings(key,value) VALUES('sourceDomains',${JSON.stringify(body.sourceDomains)}) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`,sql`INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at) VALUES(${crypto.randomUUID()},'settings',1,${user.id},'SOURCE_DOMAINS_CHANGED',${JSON.stringify(body)},'आधिकारिक स्रोत नियम बदले',${now})`]);return json({success:true});}catch(error){return failure(error);}}
