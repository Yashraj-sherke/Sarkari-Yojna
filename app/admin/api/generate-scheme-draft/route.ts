import { checkOrigin,json,failure,HttpError } from '@/lib/server';
import { requirePermission } from '@/lib/admin-auth';
import { adminRateLimit } from '@/lib/admin-rate-limit';
import { saveDraft } from '@/lib/admin-cms';
import { generateNewSchemeDraft } from '@/lib/news-generator';
export async function POST(req:Request){try{checkOrigin(req);const user=await requirePermission('edit');await adminRateLimit(user.id,'ai-generation',10);const generated=await generateNewSchemeDraft();const result=await saveDraft(generated,'AI generated draft — human official-source verification required',0);return json({...result,success:true});}catch(error){if(error instanceof HttpError||error&&typeof error==='object'&&'issues' in error)return failure(error);return json({error:'AI draft नहीं बन सका। GEMINI_API_KEY और provider response जाँचें; कोई publication नहीं हुई।'},503);}}
