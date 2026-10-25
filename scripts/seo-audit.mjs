import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { auditHtml, auditCollection, decodeText, isPublicAuditUrl } from '../lib/seo-audit.mjs';

const origin = new URL(process.env.SEO_AUDIT_ORIGIN || 'https://www.sarkariyojanasetu.com').origin;
if (!['https://www.sarkariyojanasetu.com', 'http://localhost:3100', 'http://127.0.0.1:3100'].includes(origin)) {
  throw new Error('Use the public production origin or the isolated local server on port 3100.');
}
const expectedOrigin = 'https://www.sarkariyojanasetu.com';
const limit = Math.min(1000, Math.max(1, Number(process.env.SEO_AUDIT_LIMIT) || 60));
const folder = resolve('artifacts/seo', origin === expectedOrigin ? 'live' : 'local');
await mkdir(folder, { recursive: true });
async function read(path) {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error('Cross-origin requests are not allowed');
  const started = Date.now();
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'SarkariYojanaSetu-SEO-Audit/1.0' } });
    const body = await response.text();
    return { url: url.href, status: response.status, body, milliseconds: Date.now() - started, robots: response.headers.get('x-robots-tag') ?? '', location: response.headers.get('location') ?? '', error: '' };
  } catch (error) {
    return { url: url.href, status: 0, body: '', milliseconds: Date.now() - started, robots: '', location: '', error: error.message };
  }
}

const robots = await read('/robots.txt');
const sitemap = await read('/sitemap.xml');
const notices = [];
const visitedSitemaps = new Set();
async function collectSitemap(response, depth = 0) {
  if (depth > 5 || visitedSitemaps.size >= 100) {
    notices.push('Sitemap recursion limit reached');
    return [];
  }
  if (visitedSitemaps.has(response.url)) return [];
  visitedSitemaps.add(response.url);
  if (response.status !== 200) {
    notices.push(`Sitemap unavailable: ${response.url} HTTP ${response.status}`);
    return [];
  }
  const locations = [...response.body.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map(match => decodeText(match[1]));
  if (/<urlset\b/.test(response.body)) return locations;
  if (!/<sitemapindex\b/.test(response.body)) {
    notices.push(`Invalid sitemap XML: ${response.url}`);
    return [];
  }
  const urls = [];
  for (const location of locations) {
    let child;
    try { child = new URL(location); } catch { notices.push(`Invalid child sitemap: ${location}`); continue; }
    if (child.origin !== expectedOrigin || child.username || child.password || child.search || child.hash) {
      notices.push(`Unexpected child sitemap: ${location}`); continue;
    }
    urls.push(...await collectSitemap(await read(child.pathname), depth + 1));
  }
  return urls;
}
const sitemapUrls = await collectSitemap(sitemap);
if (sitemap.status !== 200) notices.push(`Sitemap HTTP ${sitemap.status || 'unavailable'}`);
if (robots.status !== 200) notices.push(`Robots HTTP ${robots.status || 'unavailable'}`);
if (!robots.body.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) notices.push('Expected sitemap reference missing from robots.txt');
if (new Set(sitemapUrls).size !== sitemapUrls.length) notices.push('Duplicate sitemap entries');
for (const url of sitemapUrls) {
  if (!isPublicAuditUrl(url, expectedOrigin)) notices.push(`Unexpected/noncanonical sitemap URL: ${url}`);
}
const queue = ['/', ...sitemapUrls.filter(url => isPublicAuditUrl(url, expectedOrigin)).map(url => new URL(url).pathname), '/yojna', '/praman-patr', '/samachar', '/state/madhya-pradesh'];
const visited = new Set();
const pages = [];
while (queue.length && pages.length < limit) {
  const path = queue.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  const response = await read(path);
  const canonicalUrl = new URL(path, expectedOrigin).href;
  const page = { ...auditHtml(response.body, canonicalUrl, response.robots), status: response.status, milliseconds: response.milliseconds, location: response.location, error: response.error };
  if (page.status !== 200) page.issues = [`HTTP ${page.status || 'unavailable'}${page.error ? ': ' + page.error : ''}`];
  pages.push(page);
  if (page.status === 200) {
    for (const link of page.links) {
      if (isPublicAuditUrl(link, expectedOrigin)) queue.push(new URL(link).pathname);
      else if (origin !== expectedOrigin && isPublicAuditUrl(link, origin)) queue.push(new URL(link).pathname);
    }
  }
  console.log(`${page.status || 'ERROR'} ${path} (${page.issues.length} observations)`);
}
const failures = pages.filter(page => page.status === 0).length;
const incomingLinks = pages.map(page => ({
  url: page.url,
  incomingPages: pages.filter(other => other.status === 200 && other.url !== page.url &&
    other.links.some(link => link.replace(/\/$/, '') === page.url.replace(/\/$/, ''))).length,
}));
const findings = auditCollection(pages, sitemapUrls);
const report = {
  checkedAt: new Date().toISOString(), origin, sitemapStatus: sitemap.status, robotsStatus: robots.status,
  sitemapUrls, notices, limited: queue.some(path => !visited.has(path)), networkFailures: failures,
  scope: `Bounded public HTML scan, maximum ${limit} pages. No private routes, query variants, JavaScript execution, external requests, Google metrics or Core Web Vitals. Timing is a single HTTP sample, not a performance score. Incoming links count distinct scanned source pages, not Search Console links.`,
  incomingLinks, pages, findings,
};
await writeFile(resolve(folder, 'latest.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Saved ${pages.length} pages to ${folder}/latest.json; ${failures} network failures.`);
if (failures || sitemap.status !== 200 || robots.status !== 200 || findings.some(finding =>
  /Sitemap URL (returns|is noindex|canonical)/.test(finding.issue))) process.exitCode = 1;
