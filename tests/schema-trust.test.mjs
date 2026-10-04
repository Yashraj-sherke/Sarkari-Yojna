import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';

test('root identity schema uses the independent site identity consistently', async () => {
  const source = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert(source.includes('SITE_ALTERNATE_NAMES'));
  assert(source.includes('"@id": "https://www.sarkariyojanasetu.com/#website"'));
  assert(source.includes('"@id": "https://www.sarkariyojanasetu.com/#organization"'));
  assert(source.includes('"publisher": {"@id": "https://www.sarkariyojanasetu.com/#organization"}'));
});

test('scheme and information pages avoid deprecated HowTo markup and expose breadcrumbs', async () => {
  const scheme = await readFile(new URL('../app/yojna/[slug]/page.tsx', import.meta.url), 'utf8');
  const information = await readFile(new URL('../components/information-page.tsx', import.meta.url), 'utf8');
  assert.equal(scheme.includes("'@type': 'HowTo'"), false);
  assert(information.includes("'@type':'BreadcrumbList'"));
});

test('root layout does not globally preload the homepage hero asset', async () => {
  const source = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.equal(source.includes('preload" href="/hero-bg.webp"'), false);
});