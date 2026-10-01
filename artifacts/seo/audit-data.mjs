import {seeds} from '../../lib/seed.ts';
import {officialContent} from '../../lib/official-content.ts';
import {mpSchemes} from '../../lib/mp-schemes-data.ts';
import {isIndexableScheme} from '../../lib/seo.ts';
import {rankSchemes, officialUrl, schemeSchema} from '../../lib/domain.ts';
import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
const group=(rows, key)=>Object.entries(Object.groupBy(rows,key)).filter(([,v])=>v.length>1).map(([key,v])=>({key,count:v.length,slugs:v.map(x=>x.slug)}));
const duplicateKeys=[];
for(const file of ['lib/official-content.ts','lib/mp-schemes-data.ts','lib/scheme-content/reviewed-corrections.ts']){
 const src=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
 function walk(n){if(ts.isObjectLiteralExpression(n)){const seen=new Set();for(const p of n.properties){if(p.name){const key=p.name.getText(src).replace(/^['"]|['"]$/g,'');if(seen.has(key))duplicateKeys.push({file,key,line:src.getLineAndCharacterOfPosition(p.getStart(src)).line+1});seen.add(key);}}}ts.forEachChild(n,walk);}walk(src);
}
const profiles={farmer:{state:'madhya-pradesh',occupation:'farmer',age:40,rural:true},female:{state:'madhya-pradesh',gender:'female',age:30},student:{state:'madhya-pradesh',occupation:'student',age:20},senior:{state:'other',age:72},disability:{state:'madhya-pradesh',age:40},unemployed:{state:'madhya-pradesh',occupation:'other',age:24},rural:{state:'madhya-pradesh',rural:true},urban:{state:'madhya-pradesh',rural:false}};
const count=key=>Object.fromEntries(Object.entries(Object.groupBy(seeds,key)).map(([k,v])=>[k,v.length]));
const report={date:new Date().toISOString(),total:seeds.length,status:count(s=>s.status),editorial:count(s=>s.editorial?.publicationStatus??'MISSING'),verification:count(s=>s.editorial?.verificationStatus??'MISSING'),indexable:seeds.filter(isIndexableScheme).map(s=>s.slug),duplicateKeys,duplicateSlugs:group(seeds,s=>s.slug),mpDuplicateSlugs:group(mpSchemes,s=>s.slug),duplicateTitles:group(seeds,s=>s.title.normalize('NFKC').trim()),missingOfficial:seeds.filter(s=>!officialUrl(s.sourceUrl)).map(s=>s.slug),missingReview:seeds.filter(s=>!s.nextReviewAt).map(s=>s.slug),overdue:seeds.filter(s=>s.nextReviewAt&&new Date(s.nextReviewAt)<new Date()).map(s=>s.slug),missingAccess:seeds.filter(s=>!s.references?.some(r=>r.accessedAt)).length,reviewed:seeds.filter(s=>s.editorial?.publicationStatus==='REVIEWED'),pilots:seeds.filter(s=>['pm-kisan','ayushman-bharat','pm-awas-gramin'].includes(s.slug)),sample:seeds.filter(s=>s.isSample).length,invalid:seeds.filter(s=>!schemeSchema.safeParse(s).success).map(s=>s.slug),homepageApplications:seeds.filter(s=>s.applicationUrl&&new URL(s.applicationUrl).pathname==='/').map(s=>s.slug),officialCount:Object.keys(officialContent).length,profiles:Object.fromEntries(Object.entries(profiles).map(([name,p])=>[name,rankSchemes(seeds,p).slice(0,8).map(r=>({slug:r.scheme.slug,score:r.score,missing:r.missing,editorial:r.scheme.editorial?.publicationStatus,reasons:r.reasons}))]))};
writeFileSync('artifacts/seo/audit-data.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,reviewed:report.reviewed.map(s=>({slug:s.slug,references:s.references})),pilots:report.pilots.map(s=>({slug:s.slug,status:s.status,editorial:s.editorial,source:s.sourceUrl,access:s.references?.map(r=>r.accessedAt),department:s.department,verified:s.verifiedAt,next:s.nextReviewAt})),profiles:report.profiles},null,2));
