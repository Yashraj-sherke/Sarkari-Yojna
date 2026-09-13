import {checkOrigin,db,failure,json,session} from '@/lib/server';
export async function DELETE(req:Request){try{checkOrigin(req);const s=await session(req);if(s)await db().prepare('DELETE FROM sessions WHERE id=?').bind(s.id).run();return json({ok:true},200,'sy_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');}catch(e){return failure(e);}}
