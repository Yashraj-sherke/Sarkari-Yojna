import { z } from 'zod';
import { requirePermission } from '@/lib/admin-auth';
import { getDraft,saveDraft } from '@/lib/admin-cms';
import { checkOrigin,readBody,json,failure,HttpError } from '@/lib/server';
export async function POST(req:Request){try{checkOrigin(req);await requirePermission('edit');const body=z.object({slug:z.string().max(100),newSlug:z.string().regex(/^[a-z][a-z0-9-]*$/).max(100)}).strict().parse(await readBody(req));const original=await getDraft(body.slug);if(!original)throw new HttpError(404,'योजना नहीं मिली।');return json(await saveDraft({...original.data,slug:body.newSlug,status:'DRAFT'},'मौजूदा योजना से नया draft बनाया',0));}catch(error){return failure(error);}}
