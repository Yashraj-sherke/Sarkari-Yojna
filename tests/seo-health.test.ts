import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seeds} from '../lib/seed';
import {schemeHealth} from '../lib/seo-health';

test('health flags missing evidence without changing publication status', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'pm-kisan')!, status: 'DRAFT' as const, sourceUrl: '', verifiedAt: null, editorial: undefined, references: [], nextReviewAt: null};
  const before = JSON.stringify(scheme);
  const health = schemeHealth(scheme);
  assert.equal(health.indexable, false);
  assert(health.issues.includes('Official source missing or unsupported'));
  assert(health.issues.includes('Human publication review required'));
  assert.equal(JSON.stringify(scheme), before);
});

test('health distinguishes overdue dates and absent application information', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'pm-kisan')!, nextReviewAt: '2000-01-01', applicationUrl: ''};
  const health = schemeHealth(scheme);
  assert.equal(health.indexable, false);
  assert(health.issues.some(issue => issue.includes('overdue')));
  assert(health.issues.some(issue => issue.includes('online/offline applicability')));
});
