import { officialUrl, type Scheme } from './domain';
import { contentDate, isIndexableScheme, schemeSearchPresentation } from './seo';

export function schemeHealth(scheme: Scheme) {
  const issues: string[] = [];
  if (!officialUrl(scheme.sourceUrl)) issues.push('Official source missing or unsupported');
  if (!contentDate(scheme.editorial?.reviewedAt)) issues.push('Editorial verification date missing or invalid');
  if (scheme.editorial?.verificationStatus !== 'VERIFIED_CORE') issues.push('Official fact verification incomplete');
  if (scheme.editorial?.publicationStatus !== 'REVIEWED') issues.push('Human publication review required');
  if (!scheme.nextReviewAt || !contentDate(scheme.nextReviewAt) || new Date(scheme.nextReviewAt) <= new Date()) issues.push('Review due date missing, invalid or overdue');
  if (!scheme.applicationUrl) issues.push('Application destination absent: confirm online/offline applicability');
  if (!scheme.references?.some(reference => officialUrl(reference.url) && contentDate(reference.accessedAt))) issues.push('Dated official reference missing');
  if (!scheme.eligibilityDescription?.length && !scheme.rules.length) issues.push('Eligibility evidence needs review');
  if (!scheme.documents.length) issues.push('Document requirements not recorded; do not invent them');
  if (!scheme.steps.length && !scheme.applicationProcess?.length) issues.push('Application process missing');
  if (!scheme.trackingGuidance) issues.push('Status/tracking guidance not recorded');
  return { slug: scheme.slug, title: scheme.title, indexable: isIndexableScheme(scheme), description: schemeSearchPresentation(scheme).description, issues };
}
