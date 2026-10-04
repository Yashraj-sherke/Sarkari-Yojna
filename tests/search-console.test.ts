import test from 'node:test';
import assert from 'node:assert';
import { searchConsoleOpportunityReport } from '../lib/search-console';

test('searchConsoleOpportunityReport - Phase 19 Rules', async (t) => {
  const mockDataset = [
    { query: 'high imp low ctr', page: 'https://a.com/1', clicks: 5, impressions: 500, ctr: 0.01, position: 2 },
    { query: 'high imp pos 10', page: 'https://a.com/2', clicks: 40, impressions: 400, ctr: 0.1, position: 10 },
    { query: 'low imp', page: 'https://a.com/3', clicks: 2, impressions: 45, ctr: 0.05, position: 25 },
  ];

  await t.test('detects all three branches based on dynamic dataset averages', () => {
    const report = searchConsoleOpportunityReport(mockDataset);
    assert.strictEqual(report.available, true);
    assert.strictEqual(report.rows.length, 3);
    
    const rule1 = report.rows.find(r => r.query === 'high imp low ctr');
    assert.strictEqual(rule1?.opportunity, 'High impressions + Low CTR');
    assert.strictEqual(rule1?.suggestedAction, 'Review title/meta/snippet alignment');
    assert.strictEqual(rule1?.priority, 3);

    const rule2 = report.rows.find(r => r.query === 'high imp pos 10');
    assert.strictEqual(rule2?.opportunity, 'Position 5-20 opportunity');
    assert.strictEqual(rule2?.suggestedAction, 'Review content completeness, headings, intent, internal links');
    assert.strictEqual(rule2?.priority, 2);

    const rule3 = report.rows.find(r => r.query === 'low imp');
    assert.strictEqual(rule3?.opportunity, 'Low impressions');
    assert.strictEqual(rule3?.suggestedAction, 'Determine if new, poorly discovered, unclear intent, thin, or indexing issue');
    assert.strictEqual(rule3?.priority, 1);
  });

  await t.test('returns unavailable for empty data', () => {
    const report = searchConsoleOpportunityReport([]);
    assert.strictEqual(report.available, false);
    assert.strictEqual(report.reason, 'Query/page export unavailable');
  });
});
