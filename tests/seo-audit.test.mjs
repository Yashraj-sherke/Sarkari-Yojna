import assert from 'node:assert/strict';
import test from 'node:test';
import { auditHtml, auditCollection } from '../lib/seo-audit.mjs';
import config from '../next.config.mjs';

const url = 'https://www.sarkariyojanasetu.com/yojna/example';
test('crawler detects both header and Googlebot-specific noindex', () => {
  assert.equal(auditHtml('<meta name="googlebot" content="noindex">', url).noindex, true);
  assert.equal(auditHtml('<h1>Example</h1>', url, 'noindex, follow').noindex, true);
});
test('crawler fails sitemap redirects and canonical mismatches', () => {
  assert.ok(auditCollection([{url, status: 308}], [url]).some(f => /returns HTTP 308/.test(f.issue)));
  const page = {...auditHtml('<link rel="canonical" href="/yojna/different">', url), status: 200};
  assert.ok(auditCollection([page], [url]).some(f => /canonical points elsewhere/.test(f.issue)));
});
test('bare-domain redirect is permanent and preserves route and query handling', async () => {
  const rules = await config.redirects();
  const rule = rules.find(r => r.has?.some(condition => condition.value === 'sarkariyojanasetu.com'));
  assert.equal(rule?.source, '/:path*');
  assert.equal(rule?.destination, 'https://www.sarkariyojanasetu.com/:path*');
  assert.equal(rule?.permanent, true);
});
