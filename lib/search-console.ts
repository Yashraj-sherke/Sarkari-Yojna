import { z } from 'zod';

const rowSchema = z.object({
  query: z.string().optional(),
  page: z.string().url().optional(),
  clicks: z.number().nonnegative(),
  impressions: z.number().nonnegative(),
  ctr: z.number().min(0).max(1),
  position: z.number().positive(),
});

export type SearchConsoleRow = z.infer<typeof rowSchema> & {
  opportunity?: string;
  suggestedAction?: string;
  priority?: number;
};

export function searchConsoleOpportunityReport(input: unknown) {
  const parsed = z.array(rowSchema).safeParse(input);
  if (!parsed.success || parsed.data.length === 0) {
    return {
      available: false,
      rows: [] as SearchConsoleRow[],
      reason: 'Query/page export unavailable',
    };
  }

  const data = parsed.data;
  
  // 1. Calculate dataset-derived thresholds
  const avgImpressions = data.reduce((acc, row) => acc + row.impressions, 0) / data.length;
  const avgCtr = data.reduce((acc, row) => acc + row.ctr, 0) / data.length;

  const opportunities = data.map(row => {
    const isHighImpressions = row.impressions > avgImpressions;
    const isLowCtr = row.ctr < avgCtr;
    const isPos5to20 = row.position >= 5 && row.position <= 20;
    
    let action = '';
    let suggestedAction = '';
    let priority = 0;

    if (isHighImpressions && isLowCtr) {
      action = 'High impressions + Low CTR';
      suggestedAction = 'Review title/meta/snippet alignment';
      priority = 3;
    } else if (isHighImpressions && isPos5to20) {
      action = 'Position 5-20 opportunity';
      suggestedAction = 'Review content completeness, headings, intent, internal links';
      priority = 2;
    } else if (!isHighImpressions && row.impressions > 0) {
      action = 'Low impressions';
      suggestedAction = 'Determine if new, poorly discovered, unclear intent, thin, or indexing issue';
      priority = 1;
    }

    return { ...row, opportunity: action, suggestedAction, priority };
  })
  .filter(row => row.opportunity !== '')
  .sort((a, b) => b.priority! - a.priority! || b.impressions - a.impressions);

  return {
    available: true,
    rows: opportunities,
    reason: opportunities.length ? 'Phase 19 GSC Optimization opportunities mapped' : 'No rows matched Phase 19 rules',
    metrics: { avgImpressions, avgCtr }
  };
}