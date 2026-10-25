import { z } from 'zod';
import { checkOrigin,readBody,json,failure } from '@/lib/server';
import { actions } from '@/lib/admin-policy';
import { transitionNews } from '@/lib/admin-news';
export async function POST(req:Request){try{checkOrigin(req);const body=z.object({slug:z.string().max(100),version:z.number().int().positive(),action:z.enum(actions),note:z.string().min(5).max(2000),evidence:z.unknown().optional()}).strict().parse(await readBody(req));return json(await transitionNews(body.slug,body.version,body.action,body.note,body.evidence));}catch(error){return failure(error);}}
