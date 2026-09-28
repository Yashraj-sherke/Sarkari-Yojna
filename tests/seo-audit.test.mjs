import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditHtml, auditCollection, isPublicAuditUrl } from '../lib/seo-audit.mjs';

const origin = 'https://www.sarkariyojanasetu.com';
const html = `<title>Useful scheme information</title><meta content='A useful description' name='description'><link href='/yojna/test' rel='canonical'><h1>Test</h1><a href='/guide'>Guide</a><script>const hidden = '<h1>Not real</h1><a href="/fake">Fake</a>';</script>`;
test('reads actual HTML and ignores serialized script links/headings', () => {
  const page = auditHtml(html, origin + '/yojna/test');
  assert.equal(page.h1Count, 1);
  assert.equal(page.canonical, origin + '/yojna/test');
  assert.equal(page.description, 'A useful description');
  assert.deepEqual(page.links, [origin + '/guide']);
});
test('honors header and googlebot noindex and malformed JSON-LD', () => {
  assert.equal(auditHtml(html, origin, 'noindex').noindex, true);
  assert.equal(auditHtml(html + '<meta name="googlebot" content="none">', origin).noindex, true);
  assert(auditHtml(html + '<script type="application/ld+json">bad</script>', origin).issues.includes('Invalid JSON-LD'));
});
test('does not crawl mutations, private pages, external links or query traps', () => {
  for (const path of ['/admin', '/admin/news', '/admin-login', '/api/cron/daily-news', '/out/test', '/saved', '/yojna?page=2', '/x.pdf', 'https://evil.example/']) assert.equal(isPublicAuditUrl(path, origin), false, path);
  assert.equal(isPublicAuditUrl('/yojna/test', origin), true);
});
test('identifies sitemap noindex mismatch, duplicates and orphan candidates', () => {
  const first = { ...auditHtml(html, origin + '/yojna/test'), status: 200 };
  const second = { ...first, url: origin + '/yojna/other', noindex: true };
  const findings = auditCollection([first, second], [first.url, second.url]);
  assert(findings.some(row => row.issue === 'Sitemap URL is noindex'));
  assert(findings.some(row => row.issue.includes('orphan candidate')));
  assert(!findings.some(row => row.issue === 'Duplicate title'));
  assert(auditCollection([first, { ...second, noindex: false }], []).some(row => row.issue === 'Duplicate title'));
});
