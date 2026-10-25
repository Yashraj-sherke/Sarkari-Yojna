import { mkdir, writeFile } from 'node:fs/promises';

const urls = [
  'http://sarkariyojanasetu.com/', 'http://www.sarkariyojanasetu.com/',
  'https://sarkariyojanasetu.com/', 'https://www.sarkariyojanasetu.com/',
  'https://www.sarkariyojanasetu.com/robots.txt',
  'https://www.sarkariyojanasetu.com/sitemap.xml',
];
const results = await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, {redirect: 'manual', signal: AbortSignal.timeout(15000)});
    const body = await response.text();
    return {url, status: response.status, location: response.headers.get('location'),
      robotsHeader: response.headers.get('x-robots-tag'),
      ...(url.endsWith('/robots.txt') ? {body} : {}),
      ...(url.endsWith('/sitemap.xml') ? {sitemapEntryCount: [...body.matchAll(/<loc>/g)].length} : {})};
  } catch (error) {
    return {url, status: 0, error: error.message, cause: error.cause?.code ?? null};
  }
}));
await mkdir('artifacts/seo/runbook-2026-10-11', {recursive: true});
await writeFile('artifacts/seo/runbook-2026-10-11/live-probe.json', JSON.stringify({checkedAt: new Date().toISOString(), results}, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.status === 0)) process.exitCode = 1;
