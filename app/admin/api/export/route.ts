import { z } from 'zod';
import { requirePermission } from '@/lib/admin-auth';
import { database,getDraft } from '@/lib/admin-cms';
import { checkOrigin,readBody,json,failure,HttpError } from '@/lib/server';
export async function POST(req:Request){try{checkOrigin(req);const user=await requirePermission();const body=z.object({slugs:z.array(z.string().regex(/^[a-z][a-z0-9-]*$/)).min(1).max(100)}).strict().parse(await readBody(req));const slugs=[...new Set(body.slugs)];const records=await Promise.all(slugs.map(getDraft));if(records.some(record=>!record))throw new HttpError(404,'चयनित योजना नहीं मिली।');const sql=database();await sql`INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at) VALUES(${crypto.randomUUID()},'export',1,${user.id},'EXPORT_JSON',${JSON.stringify({slugs})},'अधिकृत JSON export',${new Date().toISOString()})`;return json({schemes:records.map(record=>record!.data)});}catch(error){return failure(error);}}
