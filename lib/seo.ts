import { type Scheme } from './domain';

/** Review expiry must not turn an existing public article into a 404. */
export function isPublicScheme(s: Pick<Scheme, 'status' | 'isSample'>) {
  return !s.isSample && ['ACTIVE', 'NEEDS_REVIEW', 'UPDATE_REQUIRED', 'CLOSED', 'ARCHIVED'].includes(s.status);
}

export function isIndexableScheme(s: Scheme) {
  // Preserve existing public articles; never advertise unpublished/sample records.
  // Editorial verification is reported separately and is not silently upgraded here.
  return isPublicScheme(s);
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
    'social-security-pension-portal-mp': 'Social Security Pension Portal MP: आवेदन और पेंशन स्टेटस',
  };
  const baseTitle = names[s.slug] ?? s.title;
  const title = names[s.slug] ?? (baseTitle.length < 42 ? `${baseTitle}: पात्रता और आवेदन` : baseTitle);
  const description = s.editorial?.verificationStatus === 'VERIFIED_CORE'
    ? `${s.title}: ${s.benefit}। पात्रता, दस्तावेज़, आवेदन और सरकारी स्रोत सरल हिन्दी में देखें।`
    : `${s.title} की जानकारी की समीक्षा जारी है। वर्तमान लाभ, पात्रता और आवेदन की पुष्टि संबंधित सरकारी विभाग से करें।`;
  return {title, description: description.replace(/\s+/g, ' ').trim()};
}
