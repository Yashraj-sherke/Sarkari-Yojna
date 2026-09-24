import type { Scheme } from './domain';

/** Data used by directory search and cards. Full articles stay on detail pages. */
export type SchemeSummary = Pick<Scheme,
  'slug' | 'title' | 'english' | 'category' | 'state' | 'summary' | 'summaryEn' |
  'benefit' | 'benefitEn' | 'department' | 'documents' | 'status' |
  'nextReviewAt' | 'lastUpdated' | 'sourceUrl' | 'isSample' | 'editorial'
>;

export function summarizeScheme(s: Scheme): SchemeSummary {
  const { slug, title, english, category, state, summary, summaryEn, benefit,
    benefitEn, department, documents, status, nextReviewAt, lastUpdated, sourceUrl, isSample, editorial } = s;
  return { slug, title, english, category, state, summary, summaryEn, benefit,
    benefitEn, department, documents, status, nextReviewAt, lastUpdated, sourceUrl, isSample, editorial };
}
