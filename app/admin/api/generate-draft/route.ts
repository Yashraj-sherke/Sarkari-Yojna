import { requirePermission } from '@/lib/admin-auth';
import { checkOrigin,json,failure,HttpError } from '@/lib/server';
export async function POST(req:Request){try{checkOrigin(req);await requirePermission('edit');throw new HttpError(410,'Demo AI extraction हटाया गया है। Verified research JSON को /admin/import पर validate करके draft में इम्पोर्ट करें।');}catch(error){return failure(error);}}
