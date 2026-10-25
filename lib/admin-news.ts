import { z } from 'zod';
import { officialUrl } from './domain';
import { database, refreshPublic, checkSourceDomains } from './admin-cms';
import { requirePermission } from './admin-auth';
import { nextState, reviewEvidenceSchema, type WorkflowState, type WorkflowAction } from './admin-policy';
import { HttpError } from './server';
import { adminRateLimit } from './admin-rate-limit';
export const newsDraftSchema=z.object({
 slug:z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).max(100), title:z.string().min(5).max(180), summary:z.string().min(10).max(300),
 category:z.string().min(2).max(100), body:z.array(z.string().min(1).max(15000)).min(1).max(30), imageUrl:z.string().max(1500).optional(),
 sourceUrl:z.string().refine(value=>!value||officialUrl(value)), sourceVerifiedAt:z.string().nullable(),
 changes:z.string().max(2000), affected:z.string().max(2000),schemeSlugs:z.array(z.string().regex(/^[a-z][a-z0-9-]*$/)).max(20),
}).strict();
export type NewsDraft=z.infer<typeof newsDraftSchema>;
export type NewsRecord={version:number;workflow:WorkflowState;data:NewsDraft;reviewed_at:string|null;published:boolean};
export async function getNewsDraft(slug:string):Promise<NewsRecord|null>{
 const sql=database();const [drafts,publicRows]=await Promise.all([sql`SELECT * FROM cms_news_drafts WHERE slug=${slug}`,sql`SELECT * FROM samachar WHERE slug=${slug}`]);
 const published=publicRows[0]?.status==='PUBLISHED';
 if(drafts.length){const row=drafts[0];return {version:row.version,workflow:row.workflow as WorkflowState,data:newsDraftSchema.parse(JSON.parse(row.data)),reviewed_at:row.reviewed_at,published};}
 if(!publicRows.length)return null;const row=publicRows[0];return {version:0,workflow:'DRAFT',reviewed_at:null,published,data:{slug:row.slug,title:row.title,summary:row.summary,category:row.category,body:JSON.parse(row.body),imageUrl:row.image_url??'',sourceUrl:row.source_url??'',sourceVerifiedAt:null,changes:row.changes??'',affected:row.affected??'',schemeSlugs:row.scheme_slugs??[]}};
}
export async function saveNewsDraft(input:unknown,version:number,oldSlug:string|undefined,note:string){const user=await requirePermission('edit');const sql=database();const data=newsDraftSchema.parse(input);
 await adminRateLimit(user.id,'news-save');
 if(oldSlug&&oldSlug!==data.slug)throw new HttpError(400,'मौजूदा URL नहीं बदल सकते।');
 if(!oldSlug&&await getNewsDraft(data.slug))throw new HttpError(409,'Slug पहले से मौजूद है।');
 const now=new Date().toISOString();
 const rows=await sql`WITH saved AS (INSERT INTO cms_news_drafts(slug,data,version,workflow,updated_at,updated_by) VALUES(${data.slug},${JSON.stringify(data)},1,'DRAFT',${now},${user.id})
 ON CONFLICT(slug) DO UPDATE SET data=EXCLUDED.data,version=cms_news_drafts.version+1,workflow='DRAFT',updated_at=EXCLUDED.updated_at,updated_by=EXCLUDED.updated_by,reviewed_at=NULL,reviewed_by=NULL,review_note=NULL WHERE cms_news_drafts.version=${version} AND cms_news_drafts.workflow NOT IN ('IN_REVIEW','ARCHIVED') RETURNING *),
 history AS (INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at) SELECT ${crypto.randomUUID()},${'news:'+data.slug},version,${user.id},'NEWS_SAVE_DRAFT',data,${note},${now} FROM saved) SELECT version FROM saved`;
 if(!rows.length)throw new HttpError(409,'रिकॉर्ड बदल गया है या समीक्षा में है।');return {slug:data.slug,version:rows[0].version};
}
export async function transitionNews(slug:string,version:number,action:WorkflowAction,note:string,evidence:unknown){const user=await requirePermission();const sql=database();const draft=await getNewsDraft(slug);
 await adminRateLimit(user.id,'news-workflow');
 if(!draft||!draft.version)throw new HttpError(400,'पहले draft सहेजें।');if(draft.version!==version)throw new HttpError(409,'रिकॉर्ड बदल गया है।');
 let target:WorkflowState;try{target=nextState(draft.workflow as WorkflowState,action,user.role);}catch(error){throw new HttpError(403,(error as Error).message);}
 const data=newsDraftSchema.parse(draft.data),now=new Date().toISOString();
 if(['archive','unpublish'].includes(action)&&!draft.published)throw new HttpError(400,'इस समाचार का सार्वजनिक संस्करण नहीं है।');
 if(action==='approve'||action==='publish'){
  await checkSourceDomains([data.sourceUrl]);
  const date=data.sourceVerifiedAt?new Date(data.sourceVerifiedAt):null;
  if(!data.sourceUrl||!data.changes.trim()||!data.affected.trim()||!data.schemeSlugs.length||!date||!Number.isFinite(date.getTime())||date>new Date())throw new HttpError(400,'आधिकारिक स्रोत, सत्यापन तिथि, बदलाव, प्रभावित नागरिक और संबंधित योजना भरें।');
  const related=await sql`SELECT slug FROM schemes WHERE slug=ANY(${data.schemeSlugs}::text[]) AND status IN ('ACTIVE','NEEDS_REVIEW','UPDATE_REQUIRED','CLOSED','ARCHIVED')`;
  if(related.length!==new Set(data.schemeSlugs).size)throw new HttpError(400,'संबंधित योजना का सार्वजनिक रिकॉर्ड नहीं मिला।');
  if(action==='approve')note=reviewEvidenceSchema.parse(evidence).note;
  if(action==='publish'&&!draft.reviewed_at)throw new HttpError(400,'मानव समीक्षा आवश्यक है।');
 }
 const rows=await sql`WITH changed AS (UPDATE cms_news_drafts SET workflow=${target},version=version+1,updated_at=${now},updated_by=${user.id},reviewed_at=CASE WHEN ${action}='approve' THEN ${now} WHEN ${target}='DRAFT' THEN NULL ELSE reviewed_at END,reviewed_by=CASE WHEN ${action}='approve' THEN ${user.id} WHEN ${target}='DRAFT' THEN NULL ELSE reviewed_by END,review_note=CASE WHEN ${action}='approve' THEN ${note} WHEN ${target}='DRAFT' THEN NULL ELSE review_note END WHERE slug=${slug} AND version=${version} AND workflow=${draft.workflow} RETURNING *),
 published AS (INSERT INTO samachar(slug,title,summary,category,image_url,body,status,published_at,created_at,updated_at,source_url,changes,affected,scheme_slugs)
 SELECT slug,${data.title},${data.summary},${data.category},${data.imageUrl??null},${JSON.stringify(data.body)},'PUBLISHED',${now},${now},${now},${data.sourceUrl},${data.changes},${data.affected},${JSON.stringify(data.schemeSlugs)}::jsonb FROM changed WHERE ${action}='publish'
 ON CONFLICT(slug) DO UPDATE SET title=EXCLUDED.title,summary=EXCLUDED.summary,category=EXCLUDED.category,image_url=EXCLUDED.image_url,body=EXCLUDED.body,status='PUBLISHED',published_at=EXCLUDED.published_at,updated_at=EXCLUDED.updated_at,source_url=EXCLUDED.source_url,changes=EXCLUDED.changes,affected=EXCLUDED.affected,scheme_slugs=EXCLUDED.scheme_slugs),
 hidden AS (UPDATE samachar SET status='DRAFT',updated_at=${now} WHERE slug IN(SELECT slug FROM changed) AND ${action} IN ('archive','unpublish')),
 history AS (INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at) SELECT ${crypto.randomUUID()},${'news:'+slug},version,${user.id},${'NEWS_'+action},data,${note},${now} FROM changed) SELECT version FROM changed`;
 if(!rows.length)throw new HttpError(409,'रिकॉर्ड बदल गया है।');if(['publish','unpublish','archive'].includes(action))refreshPublic(slug);return {slug,version:rows[0].version};
}


