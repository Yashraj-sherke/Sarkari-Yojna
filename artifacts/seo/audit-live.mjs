import {writeFileSync,mkdirSync} from 'node:fs';
import {auditHtml} from '../../lib/seo-audit.mjs';
const base='https://www.sarkariyojanasetu.com',folder='artifacts/seo/master-evidence';mkdirSync(folder,{recursive:true});
const paths=['/','/sitemap.xml','/robots.txt','/yojna','/yojna?page=2','/yojna/pm-kisan','/yojna/ayushman-bharat','/yojna/pm-awas-gramin','/status-directory','/admin','/admin/seo','/admin-login','/guide/pm-kisan-ekyc'];
const rows=[];for(const path of paths){try{const r=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});const html=await r.text();writeFileSync(folder+'/live-'+encodeURIComponent(path)+'.html',html);rows.push({path,status:r.status,location:r.headers.get('location'),...auditHtml(html,base+path,r.headers.get('x-robots-tag')||''),sitemapCount:path==='/sitemap.xml'?[...html.matchAll(/<loc>/g)].length:undefined,schemeCount:path==='/sitemap.xml'?[...html.matchAll(/<loc>[^<]*\/yojna\//g)].length:undefined});}catch(e){rows.push({path,error:e.message})}}
writeFileSync(folder+'/live.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.map(({links,...r})=>r),null,2));
