import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {auditHtml,decodeText} from '../../lib/seo-audit.mjs';
const origin=process.env.AUDIT_BASE||'http://localhost:3100', production='https://www.sarkariyojanasetu.com';
const folder='artifacts/seo/master-evidence';mkdirSync(folder,{recursive:true});
const data=JSON.parse(readFileSync('artifacts/seo/audit-data.json','utf8'));
async function read(path){try{const r=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Twitterbot/1.0'}});const html=await r.text();return {path,status:r.status,location:r.headers.get('location'),robots:r.headers.get('x-robots-tag')||'',html};}catch(e){return {path,status:0,html:'',robots:'',error:e.message}}}
const map=await read('/sitemap.xml'),robots=await read('/robots.txt');
const sitemap=[...map.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>decodeText(m[1]));
const probes=['/status-directory','/mere-liye','/state/madhya-pradesh','/state/central','/category/swasthya','/yojna/ayushman-bharat','/yojna/pm-awas-gramin','/yojna/ladli-behna','/yojna/mp-scholarship','/admin','/admin/seo','/admin/news','/admin/schemes','/admin-login','/admin/api/schemes','/api/admin','/api/cron/daily-news','/api/status-directory/csv','/guide/pm-kisan-ekyc','/pm-kisan','/yojna?page=1','/yojna?page=2','/yojna?page=3','/yojna?page=abc','/yojna?page=-1','/yojna?page=99999','/yojna?page=2junk','/yojna?page=2&category=kisan','/category/kisan?page=2','/state/madhya-pradesh?page=2'];
const queue=['/',...sitemap.map(u=>new URL(u).pathname),...probes],seen=new Set(),pages=[],images=new Set();
while(queue.length&&pages.length<350){const batch=[];while(queue.length&&batch.length<8){const path=queue.shift();if(!seen.has(path)){seen.add(path);batch.push(path);}}
 const responses=await Promise.all(batch.map(read));
 for(const r of responses){const url=production+r.path;const p={...auditHtml(r.html,url,r.robots),path:r.path,status:r.status,location:r.location,error:r.error,bytes:Buffer.byteLength(r.html),cards:[...r.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').matchAll(/class="scheme-card[^]*?<h3[^>]*>[\s\S]*?<\/h3>/g)].length};
 p.images=[...r.html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>decodeText(m[1]));p.images.forEach(u=>{if(u.startsWith('/'))images.add(u)});
 p.schemeLinks=p.links.filter(u=>new URL(u).pathname.startsWith('/yojna/'));pages.push(p);
 if(probes.includes(r.path)||r.path==='/')writeFileSync(folder+'/'+encodeURIComponent(r.path||'home')+'.html',r.html);
 if(r.status===200&&(!r.path.includes('?'))&&!/^\/(admin|api)/.test(r.path)){for(const link of p.links){const u=new URL(link);if(u.origin===production&&!/^\/(admin|api|out|signin|signout|family|saved|reminders)(\/|-|$)/.test(u.pathname)&&!u.search&&!/\.[a-z0-9]+$/i.test(u.pathname))queue.push(u.pathname);}}
 }
}
const imageResults=[];for(const u of images){try{const r=await fetch(origin+u,{signal:AbortSignal.timeout(15000)});await r.arrayBuffer();imageResults.push({url:u,status:r.status})}catch(e){imageResults.push({url:u,status:0,error:e.message})}}
const normal=pages.filter(p=>p.status===200&&!p.noindex&&!p.path.includes('?')&&!p.path.startsWith('/api'));
const incoming=p=>pages.filter(q=>q.url!==p.url&&q.links.includes(p.url)).map(q=>q.path);
const report={date:new Date().toISOString(),origin,sitemapStatus:map.status,sitemap,robots:{status:robots.status,body:robots.html},pages,imageResults,summary:{crawled:pages.length,statuses:Object.fromEntries(Object.entries(Object.groupBy(pages,p=>p.status)).map(([k,v])=>[k,v.length])),indexable:normal.length,noindex:pages.filter(p=>p.noindex).length,orphans:normal.filter(p=>p.path!=='/'&&!incoming(p).length).map(p=>p.path),oneIncoming:normal.filter(p=>incoming(p).length===1).map(p=>p.path),indexableNotSitemap:normal.filter(p=>!sitemap.includes(p.url)&&!sitemap.includes(p.url.replace(/\/$/,''))).map(p=>p.path),sitemapNoindex:pages.filter(p=>sitemap.includes(p.url)&&p.noindex).map(p=>p.path),missingH1:normal.filter(p=>p.h1Count!==1).map(p=>p.path),duplicateCanonicals:Object.entries(Object.groupBy(normal,p=>p.canonical)).filter(([,v])=>v.length>1).map(([canonical,v])=>({canonical,paths:v.map(p=>p.path)})),brokenImages:imageResults.filter(r=>r.status!==200),brokenLinked:pages.filter(p=>p.status>=400&&incoming(p).length).map(p=>({path:p.path,status:p.status,incoming:incoming(p)}))}};
writeFileSync(folder+'/crawl.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.summary,null,2));console.log('PROBES',JSON.stringify(pages.filter(p=>probes.includes(p.path)).map(p=>({path:p.path,status:p.status,noindex:p.noindex,canonical:p.canonical,schemeLinks:p.schemeLinks.length,title:p.title})),null,2));
