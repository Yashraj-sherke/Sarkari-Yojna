import { checkOrigin,json,failure,HttpError } from '@/lib/server';
import { requirePermission } from '@/lib/admin-auth';
import { adminRateLimit } from '@/lib/admin-rate-limit';
import { saveNewsDraft } from '@/lib/admin-news';
import { generateDailyNewsDraft } from '@/lib/news-generator';
export async function POST(req:Request){try{checkOrigin(req);const user=await requirePermission('edit');await adminRateLimit(user.id,'ai-generation',10);const generated=await generateDailyNewsDraft();const result=await saveNewsDraft({slug:generated.slug,title:generated.title,summary:generated.summary,category:generated.category,body:generated.body,imageUrl:'',sourceUrl:'',sourceVerifiedAt:null,changes:'',affected:'',schemeSlugs:[]},0,undefined,'AI generated news draft — official-source review required');return json({...result,success:true});}catch(error){if(error instanceof HttpError||error&&typeof error==='object'&&'issues' in error)return failure(error);return json({error:'AI draft नहीं बन सका। GEMINI_API_KEY और provider response जाँचें; कोई publication नहीं हुई।'},503);}}
