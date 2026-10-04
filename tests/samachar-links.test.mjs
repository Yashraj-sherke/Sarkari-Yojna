import assert from 'node:assert/strict';
import {test} from 'node:test';
import data from '../data/samachar.json' with {type: 'json'};
import {getSamacharRelatedSchemeSlugs, samacharQuality} from '../lib/samachar.ts';

test('news relation helper extracts only explicit internal scheme links', () => {
  const update = data.find(item => item.slug === 'pm-kisan-24th-installment-status-check');
  assert(update);
  const slugs = getSamacharRelatedSchemeSlugs(update);
  assert.deepEqual(slugs, ['pm-kisan']);
  assert(!slugs.some(slug => slug.includes('http')));
});

test('update quality holds records missing structured evidence', () => {
  const update = data.find(item => item.slug === 'pm-kisan-24th-installment-status-check');
  assert(update);
  const quality = samacharQuality(update);
  assert.equal(quality.publishable, false);
  assert(quality.issues.includes('What changed is not structured'));
  assert(quality.issues.includes('Affected audience is not structured'));
});

test('news and scheme pages contain both sides of the update relation', async () => {
  const newsPage = await (await import('node:fs/promises')).readFile(new URL('../app/samachar/[slug]/page.tsx', import.meta.url), 'utf8');
  const schemePage = await (await import('node:fs/promises')).readFile(new URL('../app/yojna/[slug]/page.tsx', import.meta.url), 'utf8');
  assert(newsPage.includes('getSamacharRelatedSchemeSlugs'));
  assert(newsPage.includes('relatedSchemes.map'));
  assert(schemePage.includes('getSamacharRelatedSchemeSlugs(update)'));
  assert(schemePage.includes('relatedUpdates'));
});