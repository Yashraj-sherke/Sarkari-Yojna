import { z } from 'zod';
import { requirePermission } from '@/lib/admin-auth';
import { database, saveDraft } from '@/lib/admin-cms';
import { checkOrigin, readBody, json, failure, HttpError } from '@/lib/server';
export async function POST(req:Request){try{checkOrigin(req);await requirePermission('edit');const body=z.object({id:z.string().uuid(),slug:z.string().max(100),version:z.number().int().min(0)}).strict().parse(await readBody(req));const sql=database();const rows=await sql`SELECT data FROM cms_history WHERE id=${body.id} AND slug=${body.slug}`;if(!rows.length)throw new HttpError(404,'संस्करण नहीं मिला।');return json(await saveDraft(JSON.parse(rows[0].data),'इतिहास से working draft पुनर्स्थापित',body.version,body.slug));}catch(error){return failure(error);}}
