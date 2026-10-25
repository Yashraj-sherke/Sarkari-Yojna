import { z } from 'zod';
import { checkOrigin,readBody,json,failure } from '@/lib/server';
import { saveNewsDraft } from '@/lib/admin-news';
export async function POST(req:Request){try{checkOrigin(req);const body=z.object({data:z.unknown(),version:z.number().int().min(0),oldSlug:z.string().optional(),note:z.string().min(5).max(2000)}).strict().parse(await readBody(req));return json(await saveNewsDraft(body.data,body.version,body.oldSlug,body.note));}catch(error){return failure(error);}}
