import type { Scheme } from './domain';

/** Shared relevance rules for navigation in both directions, not eligibility. */
export function isGuideRelevantToScheme(slug: string, scheme: Pick<Scheme, 'category' | 'documents'>) {
  switch (slug) {
    case 'safe-application':
      return true;
    case 'income-certificate':
      return scheme.documents.some(document => /आय प्रमाण|income certificate/i.test(document));
    case 'ration-card':
      return scheme.category === 'khadya' || scheme.documents.some(document => /राशन|ration/i.test(document));
    default:
      return false;
  }
}
