import { effectiveStatus, type Scheme } from './domain';

export function isIndexableScheme(s: Scheme) {
  // Indexable if the scheme is active.
  // The editorial review status is no longer required for indexing to avoid unintended noindex.
  return s.status === 'ACTIVE';
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
    'social-security-pension-portal-mp': 'Social Security Pension Portal MP 2026: Online Apply, Pension Status, Passbook और ₹600 Pension की पूरी जानकारी',
  };
  const baseTitle = names[s.slug] ?? s.title;
  const title = names[s.slug] ?? (baseTitle.length < 42 ? `${baseTitle}: पात्रता और आवेदन` : baseTitle);
  const description = isIndexableScheme(s)
    ? `${s.title}: ${s.benefit}। पात्रता, दस्तावेज़, आवेदन और सरकारी स्रोत सरल हिन्दी में देखें।`
    : `${s.title} की जानकारी की समीक्षा जारी है। वर्तमान लाभ, पात्रता और आवेदन की पुष्टि संबंधित सरकारी विभाग से करें।`;
  return {title, description: description.replace(/\s+/g, ' ').trim()};
}
