import { effectiveStatus, type Scheme } from './domain';

export function isIndexableScheme(s: Scheme) {
  return effectiveStatus(s) === 'ACTIVE' && !s.isSample && Boolean(s.sourceUrl) &&
    s.editorial?.publicationStatus === 'REVIEWED';
}

/** Omit unknown dates rather than substituting another page's review date. */
export function contentDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
