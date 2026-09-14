import {writeFileSync,readFileSync} from 'node:fs';
import {seeds} from '../lib/seed.ts';
import {schemeSchema} from '../lib/domain.ts';
const esc=(v:string)=>"'"+v.replaceAll("'","''")+"'";
const rows=seeds.map(s=>schemeSchema.parse(s));
// Upgrade only original demo rows; never overwrite an administrator's reviewed content.
writeFileSync('drizzle/0002_official_content.sql',rows.map(s=>`UPDATE schemes SET data=${esc(JSON.stringify(s))},status=${esc(s.status)},next_review_at=${s.nextReviewAt?esc(s.nextReviewAt):'NULL'},updated_at='2026-09-14T00:00:00.000Z' WHERE slug=${esc(s.slug)} AND json_extract(data,'$.isSample')=1;`).join('\n'));
const path='drizzle/meta/_journal.json';
const journal=JSON.parse(readFileSync(path,'utf8'));
if(!journal.entries.some((e:{tag:string})=>e.tag==='0002_official_content'))journal.entries.push({idx:2,version:'6',when:1789344000000,tag:'0002_official_content',breakpoints:false});
writeFileSync(path,JSON.stringify(journal,null,2)+'\n');
console.log(`Validated ${rows.length} records, ${rows.filter(s=>s.status==='ACTIVE').length} reviewed against official sources.`);
