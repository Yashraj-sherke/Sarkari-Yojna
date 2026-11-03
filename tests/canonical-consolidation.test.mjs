import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('legacy eligibility query URLs are permanently consolidated', async () => {
  const source = await readFile(new URL('../proxy.ts', import.meta.url), 'utf8');
  assert.match(source, /pathname === '\/mere-liye'.*search/s);
  assert.match(source, /NextResponse\.redirect\(new URL\('\/mere-liye', request\.url\), 308\)/);
});

test('request proxy cannot add a blanket noindex directive', async () => {
  const source = await readFile(new URL('../proxy.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /X-Robots-Tag|noindex, nofollow/);
});

test('site schema does not advertise a query-string search endpoint', async () => {
  const source = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /SearchAction|search_term_string/);
});
