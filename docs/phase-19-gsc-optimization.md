# Phase 19: GSC Optimization Rules

This document outlines the systematic approach for translating Google Search Console (GSC) data into actionable optimization tasks.

## The Tri-Branch Priority System

Rather than relying on arbitrary hardcoded thresholds, the platform's `searchConsoleOpportunityReport` dynamically calculates the **average impressions** and **average CTR** of the imported dataset. It then categorizes pages into three actionable queues based on their performance relative to the site's baseline:

### Priority 1: High Impressions + Low CTR
- **Condition:** Impressions > Baseline Average AND CTR < Baseline Average
- **Action Required:** Review title, meta description, and snippet alignment. 
- **Rationale:** The page is ranking and being seen, but users are not clicking. The snippet is likely misaligned with the search intent or less appealing than competitors.

### Priority 2: Position 5-20 Opportunity
- **Condition:** Impressions > Baseline Average AND Position is between 5 and 20.
- **Action Required:** Review content completeness, headings, intent match, and internal links.
- **Rationale:** The page has proven search demand but is stuck on page 2 or the bottom of page 1. Small improvements in content depth or internal link equity can push it into the top 3.

### Priority 3: Low Impressions
- **Condition:** Impressions < Baseline Average (but > 0)
- **Action Required:** Determine if the page is new, poorly discovered, has unclear intent, is too thin, or if an indexing issue exists.
- **Rationale:** The page is either fundamentally failing to rank or targeting a topic with zero search demand. Do not blindly rewrite—diagnose the root cause first.

## Workflow

1. Export Queries/Pages from Google Search Console (28-day window recommended).
2. Save to `artifacts/seo/search-console-baseline.json`.
3. Open the SEO Health Dashboard (`/admin/seo`).
4. Review the "Phase 19 SEO Optimization Queue".
5. Address the Priority 1 & 2 issues before worrying about Priority 3.
