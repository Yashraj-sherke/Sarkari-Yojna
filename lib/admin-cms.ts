import { db, HttpError } from './server';
import { requirePermission, type AdminUser } from './admin-auth';
import { draftContent, nextState, publishingIssues, reviewEvidenceSchema, type WorkflowAction, type WorkflowState } from './admin-policy';
import { schemeSchema, type Scheme } from './domain';
import { revalidatePath, revalidateTag } from 'next/cache';
import { adminRateLimit } from './admin-rate-limit';

export type DraftRecord = { slug: string; data: Scheme; workflow: WorkflowState; version: number; updatedAt: string; updatedBy: string; reviewNote?: string; published:boolean };
export function database() { const sql = db(); if (!sql) throw new HttpError(503, 'Database configuration आवश्यक है।'); return sql; }
export async function checkSourceDomains(urls:string[]) {
  const sql=database();const rows=await sql`SELECT value FROM cms_settings WHERE key='sourceDomains'`;
  const allowed:string[]=rows.length?JSON.parse(rows[0].value):[];
  if(allowed.length && urls.some(url=>url&&!allowed.includes(new URL(url).hostname))) throw new HttpError(400,'स्रोत का domain configured अनुमत सूची में नहीं है। Super Admin से समीक्षा कराएँ।');
}
export async function getDraft(slug: string): Promise<DraftRecord | null> {
  const sql = database();
  const rows = await sql`SELECT slug,data,workflow,version,updated_at,updated_by,review_note FROM cms_drafts WHERE slug=${slug}`;
  const publicRows=await sql`SELECT data,status,updated_at FROM schemes WHERE slug=${slug}`;
  const published=!!publicRows.length&&['ACTIVE','NEEDS_REVIEW','UPDATE_REQUIRED','CLOSED','ARCHIVED'].includes(publicRows[0].status);
  if (rows.length) { const row=rows[0]; return {slug:row.slug,data:schemeSchema.parse(JSON.parse(row.data)),workflow:row.workflow,version:row.version,updatedAt:row.updated_at,updatedBy:row.updated_by,reviewNote:row.review_note,published}; }
  if (!publicRows.length) return null;
  return {slug,data:schemeSchema.parse(JSON.parse(publicRows[0].data)),workflow:'DRAFT',version:0,updatedAt:publicRows[0].updated_at,updatedBy:'legacy',published};
}
export async function saveDraft(input: unknown, note: string, expectedVersion: number, oldSlug?: string) {
  const user=await requirePermission('edit'); const sql=database(); const value=draftContent(input);
  await adminRateLimit(user.id,'scheme-save');
  if(oldSlug && value.slug!==oldSlug) throw new HttpError(400,'मौजूदा URL बदलना अनुमत नहीं है।');
  if(!oldSlug) {
    const rows=await sql`SELECT slug FROM schemes WHERE slug=${value.slug} UNION SELECT slug FROM cms_drafts WHERE slug=${value.slug}`;
    if(rows.length) throw new HttpError(409,'यह slug पहले से मौजूद है। अपडेट का विकल्प स्पष्ट रूप से चुनें।');
  } else if(!(await getDraft(oldSlug))) throw new HttpError(404,'योजना नहीं मिली।');
  const now=new Date().toISOString(); const encoded=JSON.stringify(value);
  const result=await sql`WITH saved AS (
    INSERT INTO cms_drafts(slug,data,workflow,version,updated_at,updated_by)
    VALUES(${value.slug},${encoded},'DRAFT',1,${now},${user.id})
    ON CONFLICT(slug) DO UPDATE SET data=EXCLUDED.data,workflow='DRAFT',version=cms_drafts.version+1,updated_at=EXCLUDED.updated_at,updated_by=EXCLUDED.updated_by,reviewed_at=NULL,reviewed_by=NULL,review_note=NULL
    WHERE cms_drafts.version=${expectedVersion} AND cms_drafts.workflow NOT IN ('IN_REVIEW','ARCHIVED') RETURNING *
  ), history AS (
    INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at)
    SELECT ${crypto.randomUUID()},slug,version,${user.id},'SAVE_DRAFT',data,${note},${now} FROM saved
  ) SELECT version FROM saved`;
  if(!result.length) throw new HttpError(409,'रिकॉर्ड बदल चुका है या समीक्षा में है। पेज दोबारा खोलें।');
  return {slug:value.slug,version:result[0].version,workflow:'DRAFT'};
}
export async function transition(slug: string, expectedVersion: number, action: WorkflowAction, evidence: unknown, note: string) {
  const user=await requirePermission(); const sql=database(); const draft=await getDraft(slug);
  await adminRateLimit(user.id,'scheme-workflow');
  if(!draft || !draft.version) throw new HttpError(400,'पहले draft सहेजें।');
  if(draft.version!==expectedVersion) throw new HttpError(409,'रिकॉर्ड बदल चुका है। पेज दोबारा खोलें।');
  if(['unpublish','archive'].includes(action)&&!draft.published)throw new HttpError(400,'इस योजना का सार्वजनिक संस्करण नहीं है।');
  let target: WorkflowState;
  try {target=nextState(draft.workflow,action,user.role);} catch(error) {throw new HttpError(403,(error as Error).message);}
  const content={...draft.data}; const now=new Date().toISOString();
  if(action==='approve') {
    await checkSourceDomains([content.sourceUrl,content.applicationUrl,...(content.references??[]).map(ref=>ref.url)]);
    const reviewed=reviewEvidenceSchema.parse(evidence); note=reviewed.note;
    const errors=publishingIssues(content); if(errors.length) throw new HttpError(400,errors.join(' '));
    content.verifiedAt=now; content.nextReviewAt=new Date(Date.now()+(content.priority?90:180)*86400000).toISOString();
    content.editorial={verificationStatus:'VERIFIED_CORE',publicationStatus:'REVIEWED',reviewedAt:now,note:'आधिकारिक स्रोतों के आधार पर मानव समीक्षा दर्ज की गई।'};
  }
  if(action==='publish') {
    await checkSourceDomains([content.sourceUrl,content.applicationUrl,...(content.references??[]).map(ref=>ref.url)]);
    const errors=publishingIssues(content);
    if(errors.length || content.editorial?.verificationStatus!=='VERIFIED_CORE') throw new HttpError(400,errors.join(' ') || 'समीक्षा आवश्यक है।');
  }
  if(action==='return' || action==='unpublish' || action==='restore') {
    content.editorial={verificationStatus:'NEEDS_VERIFICATION',publicationStatus:'DRAFT_REVIEW_REQUIRED',reviewedAt:null,note:''};
    content.verifiedAt=null; content.nextReviewAt=null;
  }
  const encoded=JSON.stringify(content);
  const publicEncoded=JSON.stringify({...content,sourceNotes:'',faqs:content.faqs??[],references:content.references?.map(ref=>({...ref,note:undefined}))});
  // Revision update, publication, and audit form one atomic SQL statement.
  const result=await sql`WITH changed AS (
    UPDATE cms_drafts SET data=${encoded},workflow=${target},version=version+1,updated_at=${now},updated_by=${user.id},
    reviewed_by=CASE WHEN ${action}='approve' THEN ${user.id} WHEN ${target}='DRAFT' THEN NULL ELSE reviewed_by END,
    reviewed_at=CASE WHEN ${action}='approve' THEN ${now} WHEN ${target}='DRAFT' THEN NULL ELSE reviewed_at END,
    review_note=CASE WHEN ${action}='approve' THEN ${note} WHEN ${target}='DRAFT' THEN NULL ELSE review_note END
    WHERE slug=${slug} AND version=${expectedVersion} AND workflow=${draft.workflow} RETURNING *
  ), published AS (
    INSERT INTO schemes(slug,data,status,next_review_at,updated_at)
    SELECT slug,${publicEncoded},${content.status},${content.nextReviewAt},${now} FROM changed WHERE ${action}='publish'
    ON CONFLICT(slug) DO UPDATE SET data=EXCLUDED.data,status=EXCLUDED.status,next_review_at=EXCLUDED.next_review_at,updated_at=EXCLUDED.updated_at
  ), removed AS (
    UPDATE schemes SET status=CASE WHEN ${action}='archive' THEN 'ARCHIVED' ELSE 'DRAFT' END,data=(data::jsonb || jsonb_build_object('status',CASE WHEN ${action}='archive' THEN 'ARCHIVED' ELSE 'DRAFT' END))::text,updated_at=${now}
    WHERE slug IN (SELECT slug FROM changed) AND ${action} IN ('unpublish','archive')
  ), history AS (
    INSERT INTO cms_history(id,slug,version,actor,action,data,note,created_at)
    SELECT ${crypto.randomUUID()},slug,version,${user.id},${action},data,${note},${now} FROM changed
  ) SELECT version FROM changed`;
  if(!result.length) throw new HttpError(409,'रिकॉर्ड बदल चुका है। दोबारा खोलें।');
  if(['publish','unpublish','archive'].includes(action)) refreshPublic(slug);
  return {slug,version:result[0].version,workflow:target};
}
export function refreshPublic(slug: string) {
  revalidateTag('schemes',{expire:0}); revalidateTag('samachar',{expire:0});
  for(const path of ['/', '/yojna', '/sitemap.xml', '/status-directory', '/samachar', `/yojna/${slug}`, `/samachar/${slug}`]) revalidatePath(path);
  revalidatePath('/category/[id]','page'); revalidatePath('/state/[id]','page');
}
