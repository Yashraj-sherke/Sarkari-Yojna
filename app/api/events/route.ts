import {checkOrigin,readBody,event,failure,json,rateLimit} from '@/lib/server';
import {z} from 'zod';
export async function POST(req:Request){try{checkOrigin(req);await rateLimit(req,'events',200);const v=z.object({name:z.enum(['search_performed','scheme_opened','wizard_started','official_link_clicked','category_opened'])}).strict().parse(await readBody(req));await event(v.name);return json({ok:true});}catch(e){return failure(e);}}
