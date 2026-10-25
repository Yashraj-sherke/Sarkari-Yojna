import { requirePermission } from '@/lib/admin-auth';
import { json,failure,HttpError } from '@/lib/server';
export async function POST(){try{await requirePermission('edit');throw new HttpError(501,'Persistent image storage configure करना आवश्यक है। फिलहाल hosted HTTPS image URL प्रयोग करें।');}catch(error){return failure(error);}}
