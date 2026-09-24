import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const origin = 'https://www.sarkariyojanasetu.com';
const fetchPage = async path => {
  const r = await fetch(base + path, {headers: {'User-Agent': 'Twitterbot/1.0'}, redirect: 'manual'});
  return {r, html: await r.text()};
};
const {r: mapResponse, html: sitemap} = await fetchPage('/sitemap.xml');
assert.equal(mapResponse.status, 200);
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert(urls.length > 0);
assert(!urls.some(u=>/\/(admin|api|family|saved|reminders|mere-liye)(\/|$)/.test(u)));
for (const url of urls) {
  const path = new URL(url).pathname;
  const {r, html} = await fetchPage(path);
  assert.equal(r.status, 200, path);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert(canonical, path + ': canonical missing');
  assert.equal(canonical[1].replace(/\/$/, ''), url.replace(/\/$/, ''), path);
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), path + ': sitemap URL is noindex');
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
    const data = JSON.parse(match[1]);
    assert.notEqual(data['@type'], 'GovernmentService');
    if (data['@type'] === 'BreadcrumbList') {
      data.itemListElement.forEach((item, i)=> {
        assert.equal(item.position, i+1);
        assert(html.includes('href="' + new URL(item.item).pathname + '"') || i === data.itemListElement.length - 1);
      });
    }
  }
}
for (const path of ['/yojna/does-not-exist','/category/does-not-exist','/state/does-not-exist','/guide/does-not-exist']) {
  const {r, html} = await fetchPage(path);
  assert([200,404].includes(r.status), path);
  assert(/<meta name="robots" content="[^"]*noindex/.test(html), path);
  if(r.status === 200) console.log(`LIMITATION: ${path} streams HTTP 200 with noindex; verify production handling`);
}
for (const path of ['/admin','/saved','/family','/reminders','/mere-liye']) {
  const {html} = await fetchPage(path);
  assert(/<meta name="robots" content="[^"]*noindex/.test(html), path);
}
const redirect = await fetchPage('/state/central');
assert.equal(redirect.r.status, 308);
assert.equal(new URL(redirect.r.headers.get('location'), base).pathname, '/');
const {html: robots} = await fetchPage('/robots.txt');
assert(robots.includes('Sitemap: ' + origin + '/sitemap.xml'));
assert(!robots.includes('Disallow: /\n'));
const {html: home} = await fetchPage('/');
const identity = [...home.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const website = identity.find(s=>s['@type']==='WebSite');
const organization = identity.find(s=>s['@type']==='Organization');
assert.equal(website.name, 'Sarkari Yojana');
assert(website.alternateName.includes('Sarkari Yojana Setu'));
assert(website.alternateName.includes('sarkariyojanasetu.com'));
assert.equal(website.publisher['@id'], organization['@id']);
assert.equal(organization.name, 'Sarkari Yojana');
assert(/<h1>Sarkari Yojana/.test(home));
assert(home.includes('<meta property="og:site_name" content="Sarkari Yojana"'));
assert(home.includes('<title>Sarkari Yojana'));
for (const url of urls.filter(u=>u.includes('/yojna/'))) assert(home.includes('href="' + new URL(url).pathname + '"'), url + ': home discovery link missing');
console.log(`PASS: ${urls.length} sitemap URLs, self-canonicals, noindex exclusions, JSON-LD, discovery links, missing-route noindex and central redirect`);
