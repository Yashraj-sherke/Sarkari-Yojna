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

/** Search copy never turns an unreviewed benefit into a current claim. */
export function schemeSearchPresentation(s: Scheme) {
  const names: Record<string, string> = {
    'pm-kisan': 'PM Kisan योजना: पात्रता, दस्तावेज़ और आवेदन',
    'ration-support': 'राशन कार्ड (NFSA): पात्रता, राशन मात्रा और आवेदन',
  };
  const title = names[s.slug] ?? `${s.title} — पात्रता और आवेदन`;
  const description = isIndexableScheme(s)
    ? `${s.title}: ${s.benefit}। पात्रता, दस्तावेज़, आवेदन और सरकारी स्रोत सरल हिन्दी में देखें।`
    : `${s.title} की जानकारी की समीक्षा जारी है। वर्तमान लाभ, पात्रता और आवेदन की पुष्टि संबंधित सरकारी विभाग से करें।`;
  return {title, description: description.replace(/\s+/g, ' ').trim()};
}
