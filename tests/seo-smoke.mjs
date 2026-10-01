import assert from 'node:assert/strict';
import {auditHtml} from '../lib/seo-audit.mjs';

const base = process.env.TEST_BASE_URL || 'http://localhost:5173';
const origin = 'https://www.sarkariyojanasetu.com';
async function read(path) {
  const response = await fetch(base + path, {redirect: 'manual', signal: AbortSignal.timeout(90000), headers: {'User-Agent': 'Twitterbot/1.0'}});
  return {response, html: await response.text()};
}

const {response: sitemapResponse, html: sitemap} = await read('/sitemap.xml');
assert.equal(sitemapResponse.status, 200);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.includes(origin + '/yojna'));
assert(!urls.some(url => /\/(admin|api|samachar|praman-patr)(\/|$)/.test(url)));
for (const url of urls) {
  const path = new URL(url).pathname;
  const {response, html} = await read(path);
  assert.equal(response.status, 200, path);
  const page = auditHtml(html, url, response.headers.get('x-robots-tag') ?? '');
  assert.equal(page.noindex, false, path);
  assert.equal(page.canonical.replace(/\/$/, ''), url.replace(/\/$/, ''), path);
  assert.equal(page.h1Count, 1, path);
  if (path.startsWith('/guide/')) assert(page.structuredTypes.includes('BreadcrumbList'), path);
}
for (const path of ['/admin', '/admin/seo', '/admin/news']) {
  const {response} = await read(path);
  assert.equal(response.status, 307, path);
  assert.equal(new URL(response.headers.get('location'), base).pathname, '/admin-login');
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
}
const login = await read('/admin-login');
assert.equal(login.response.status, 200);
assert(auditHtml(login.html, origin + '/admin-login').noindex);
const cron = await read('/api/cron/daily-news');
assert.equal(cron.response.status, 401);
const {html: robots} = await read('/robots.txt');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const {html: directory} = await read('/yojna');
for (const url of urls.filter(url => url.includes('/yojna/'))) assert(directory.includes(`href="${new URL(url).pathname}"`));
const {html: home} = await read('/');
assert(!home.includes('गरीब और बेसहारा महिलाओं को दी जाती है'));
assert(home.includes('सरकारी स्रोतों से संकलित जानकारी'));
console.log(`PASS: ${urls.length} sitemap URLs, canonicals, H1, guide breadcrumbs, directory links, private-route authentication/noindex, login metadata, robots, cron authorization and cautious homepage answers.`);
