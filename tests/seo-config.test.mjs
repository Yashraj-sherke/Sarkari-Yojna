import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import config from '../next.config.mjs';

test('private admin routes carry noindex response headers', async () => {
  const headers = await config.headers();
  for (const path of ['/admin/:path*', '/admin-login']) {
    assert(headers.find(rule => rule.source === path)?.headers.some(header => header.key === 'X-Robots-Tag' && header.value.includes('noindex')));
  }
});

test('sitemap includes the existing directory and retains editorial exclusions', async () => {
  const source = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  assert(source.includes('${SITE_URL}/yojna`'));

  assert(!source.includes('/admin'));
});

test('cron fails closed when its secret is absent', async () => {
  const source = await readFile(new URL('../app/api/cron/daily-news/route.ts', import.meta.url), 'utf8');
  assert(source.includes('if (!cronSecret || authHeader !=='));
});
