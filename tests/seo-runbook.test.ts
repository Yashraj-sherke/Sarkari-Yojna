import assert from 'node:assert/strict';
import test from 'node:test';
import { seeds } from '../lib/seed';
import { isPublicScheme, isIndexableScheme, schemeSearchPresentation } from '../lib/seo';
import { selectRelatedSchemes } from '../lib/related-schemes';
import { presentArticleHtml } from '../lib/article-presentation';

test('unpublished and sample records cannot enter the sitemap', () => {
  const base = seeds[0];
  for (const status of ['DRAFT', 'FACT_CHECK', 'REQUIRES_OFFICIAL_VERIFICATION'] as const) {
    assert.equal(isIndexableScheme({...base, status}), false);
  }
  assert.equal(isIndexableScheme({...base, isSample: true}), false);
});

test('review expiry preserves a public article URL', () => {
  for (const status of ['ACTIVE', 'NEEDS_REVIEW', 'UPDATE_REQUIRED', 'CLOSED', 'ARCHIVED'] as const) {
    assert.equal(isPublicScheme({status, isSample: false}), true);
  }
});

test('related links exclude unpublished records, other states and self', () => {
  const scheme = {...seeds[0], slug: 'current', state: 'madhya-pradesh' as const};
  const candidates = [scheme,
    {...scheme, slug: 'same-state'},
    {...scheme, slug: 'national', state: 'central' as const},
    {...scheme, slug: 'other-state', state: 'bihar' as const},
    {...scheme, slug: 'draft', status: 'DRAFT' as const}];
  assert.deepEqual(selectRelatedSchemes(scheme, candidates).map(s => s.slug), ['same-state', 'national']);
});

test('unverified search descriptions do not advertise a benefit as confirmed', () => {
  const s = {...seeds[0], benefit: 'UNVERIFIED_AMOUNT', editorial: undefined};
  assert.equal(schemeSearchPresentation(s).description.includes('UNVERIFIED_AMOUNT'), false);
});

test('repository sitemap candidates have a matching public detail status', () => {
  assert.ok(seeds.length > 0);
  for (const s of seeds.filter(isIndexableScheme)) assert.equal(isPublicScheme(s), true);
});

test('imported article headings cannot add another H1; unavailable guide links reach the existing pillar', () => {
  const html = '<h1 class="title">Original text</h1><a href="/yojna/ayushman-card-status">Status</a>';
  assert.equal(presentArticleHtml(html), '<h2 class="title">Original text</h2><a href="/yojna/ayushman-bharat">Status</a>');
});
