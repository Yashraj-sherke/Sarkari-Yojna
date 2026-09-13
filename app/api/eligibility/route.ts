import {allSchemes,checkOrigin,readBody,event,failure,json,rateLimit} from '@/lib/server';
import {profileSchema,rankSchemes} from '@/lib/domain';
export async function POST(req:Request){try{checkOrigin(req);await rateLimit(req,'eligibility',100);const p=profileSchema.parse(await readBody(req));const results=rankSchemes(await allSchemes(),p);await event('wizard_completed');return json(results);}catch(e){return failure(e);}}
