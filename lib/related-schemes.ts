import type { Scheme } from './domain';
import { isIndexableScheme } from './seo';

/** Prefer shared category and geography; never fill slots with unrelated schemes. */
export function selectRelatedSchemes(scheme: Scheme, schemes: Scheme[], limit = 5) {
  const applicable = (candidate: Scheme) => candidate.state === scheme.state || candidate.state === 'central' || scheme.state === 'central';
  const score = (candidate: Scheme) =>
    Number(Boolean(scheme.relatedSchemeSlugs?.includes(candidate.slug))) * 100 +
    Number(candidate.category === scheme.category) * 20 +
    Number(candidate.state === scheme.state) * 10 +
    Number(candidate.editorial?.publicationStatus === 'REVIEWED') * 2 +
    Number(candidate.priority);
  return schemes.filter(candidate => candidate.slug !== scheme.slug && isIndexableScheme(candidate) &&
    applicable(candidate) && (candidate.category === scheme.category || scheme.relatedSchemeSlugs?.includes(candidate.slug)))
    .sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}
