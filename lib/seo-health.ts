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

export function schemeInventory(scheme: Scheme) {
  const sections = [
    scheme.detailedDescription?.length,
    scheme.benefitsList?.length,
    scheme.eligibilityDescription?.length || scheme.rules.length,
    scheme.documents.length,
    scheme.applicationProcess?.length || scheme.steps.length,
    scheme.faqs?.length,
    scheme.references?.length,
  ];
  const availableIntents = [
    (scheme.eligibilityDescription?.length || scheme.rules.length) > 0 ? 'Eligibility' : null,
    scheme.documents.length > 0 ? 'Documents' : null,
    (scheme.applicationProcess?.length || scheme.steps.length) > 0 ? 'Apply' : null,
    scheme.trackingGuidance ? 'Status' : null,
  ].filter((intent): intent is string => Boolean(intent));
  const requiredIntents = ['Eligibility', 'Documents', 'Apply', 'Status'];
  const missingIntents = requiredIntents.filter(intent => !availableIntents.includes(intent));
  const health = schemeHealth(scheme);
  const classification = health.issues.length > 0
    ? 'F'
    : scheme.state !== 'central'
      ? 'C'
      : scheme.priority
        ? 'A'
        : 'H';

  return {
    slug: scheme.slug,
    title: scheme.title,
    category: scheme.category,
    state: scheme.state,
    status: scheme.status,
    priority: scheme.priority,
    indexable: health.indexable,
    officialSource: officialUrl(scheme.sourceUrl),
    latestKnownUpdate: scheme.lastUpdated ?? scheme.editorial?.reviewedAt ?? null,
    contentDepth: sections.filter(section => Number(section) > 0).length,
    primaryIntent: 'Scheme information pillar',
    availableIntents,
    missingIntents,
    searchEvidence: 'Data unavailable',
    classification,
    classificationNote: classification === 'F'
      ? 'Needs major improvement before publication'
      : classification === 'C'
        ? 'State-specific scheme opportunity'
        : classification === 'A'
          ? 'Priority pillar candidate'
          : 'Lower-priority existing record',
  };
}
