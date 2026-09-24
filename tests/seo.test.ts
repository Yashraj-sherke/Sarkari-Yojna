import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seeds} from '../lib/seed';
import {isIndexableScheme, contentDate} from '../lib/seo';
import {summarizeScheme} from '../lib/scheme-summary';

test('draft, expired, sample and source-less records stay out of public indexing', () => {
  const base = {...seeds.find(s=>s.slug==='pm-kisan')!, nextReviewAt:'2100-01-01T00:00:00Z'};
  assert.equal(isIndexableScheme(base), true);
  assert.equal(isIndexableScheme({...base, nextReviewAt:'2000-01-01'}), false);
  assert.equal(isIndexableScheme({...base, isSample:true}), false);
  assert.equal(isIndexableScheme({...base, sourceUrl:''}), false);
  assert.equal(isIndexableScheme({...base, editorial:{...base.editorial!, publicationStatus:'DRAFT_REVIEW_REQUIRED'}}), false);
  assert.equal(isIndexableScheme({...base, status:'CLOSED'}), false);
});
test('unknown sitemap dates are omitted and real dates are serialized', () => {
  assert.equal(contentDate(null), undefined);
  assert.equal(contentDate('invalid'), undefined);
  assert.equal(contentDate('2026-09-20'), '2026-09-20T00:00:00.000Z');
});
test('directory summaries preserve editorial provenance without full articles', () => {
  for (const s of seeds) {
    const summary = summarizeScheme(s);
    assert.deepEqual(summary.editorial, s.editorial);
    assert.equal('detailedDescription' in summary, false);
  }
});
