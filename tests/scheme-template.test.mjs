import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';

test('scheme template keeps hero, quick facts and TOC in the required order', async () => {
  const source = await readFile(new URL('../components/yojna-detail-client.tsx', import.meta.url), 'utf8');
  const hero = source.indexOf('<OfficialImage');
  const quickFacts = source.indexOf('<SchemeQuickFacts');
  const toc = source.indexOf('className="scheme-content-toc"');
  assert(hero >= 0);
  assert(quickFacts > hero);
  assert(toc > quickFacts);
});

test('public scheme and directory routes use explicit indexability metadata', async () => {
  const files = [
    '../app/yojna/[slug]/page.tsx',
    '../app/category/[id]/page.tsx',
    '../app/state/[id]/page.tsx',
  ];
  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.match(source, /robots\s*:\s*\{[^}]*index\s*:/s, file);
  }
  const sitemap = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
  assert.match(sitemap, /filter\(isIndexableScheme\)/);
});

test('scheme detail CSS protects mobile content from overflow and undersized nav targets', async () => {
  const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert(css.includes('.scheme-rich-article table'));
  assert(css.includes('overflow-x: auto'));
  assert(css.includes('.detail-left-nav .nav-link'));
  assert(css.includes('min-height: 48px'));
});