import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seeds} from '../lib/seed';
import {schemeContentBrief, schemeHealth, schemeInventory, schemeOnPageAudit, schemeQualityGate} from '../lib/seo-health';
import {searchConsoleOpportunityReport} from '../lib/search-console';

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

test('inventory reports deterministic coverage without inventing demand data', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'gobardhan-scheme')!};
  const inventory = schemeInventory(scheme);
  assert.equal(inventory.slug, 'gobardhan-scheme');
  assert.equal(inventory.priority, true);
  assert.equal(inventory.primaryIntent, 'Scheme information pillar');
  assert(inventory.missingIntents.includes('Status'));
  assert.equal(inventory.searchEvidence, 'Data unavailable');
  assert.equal(typeof inventory.contentDepth, 'number');
  assert(inventory.availableIntents.includes('Eligibility'));
  assert(['A', 'B', 'C', 'F', 'H'].includes(inventory.classification));
  assert.equal('searchVolume' in inventory, false);
});

test('content brief turns inventory gaps into review tasks without publishing', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'gobardhan-scheme')!};
  const brief = schemeContentBrief(scheme);
  assert.equal(brief.pageType, 'Scheme pillar');
  assert.equal(brief.primaryQuery, 'Official scheme name: गोबरधन योजना (GOBARdhan Scheme)');
  assert(brief.requiredAnswer.includes('कौन may qualify') || brief.requiredAnswer.includes('who may qualify'));
  assert(brief.relatedPages.includes('/category/kisan'));
  assert(brief.requiredSections.includes('Official sources'));
  assert(brief.missingEvidence.includes('Status evidence or section'));
  assert.equal(brief.publishable, false);
  assert(['P1', 'P2'].includes(brief.publishingPriority));
});

test('combined quality gate blocks schemes with evidence or content gaps', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'gobardhan-scheme')!};
  const gate = schemeQualityGate(scheme);
  assert.equal(gate.publishable, false);
  assert.equal(gate.evidenceReady, false);
  assert.equal(gate.contentReady, false);
  assert(gate.blockers.length > 0);
});

test('Search Console opportunity parser stays unavailable without query/page evidence', () => {
  const report = searchConsoleOpportunityReport(null);
  assert.equal(report.available, false);
  assert.equal(report.rows.length, 0);
});

test('Search Console opportunity parser filters position 4-20 rows', () => {
  const report = searchConsoleOpportunityReport([
    {query: 'scheme', page: 'https://www.sarkariyojanasetu.com/yojna/pm-kisan', clicks: 2, impressions: 20, ctr: 0.1, position: 8},
    {query: 'other', page: 'https://www.sarkariyojanasetu.com/yojna/pm-kisan', clicks: 1, impressions: 10, ctr: 0.1, position: 32},
  ]);
  assert.equal(report.available, true);
  assert.equal(report.rows.length, 1);
  assert.equal(report.rows[0].query, 'scheme');
});

test('on-page audit reports implementation readiness without ranking claims', () => {
  const scheme = {...seeds.find(scheme => scheme.slug === 'pm-kisan')!};
  const audit = schemeOnPageAudit(scheme);
  assert.equal(audit.checks.canonical, true);
  assert.equal(audit.checks.h1, true);
  assert.equal(typeof audit.status, 'string');
  assert.equal('ranking' in audit, false);
});
