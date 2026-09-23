export const SITE_NAME_EN = 'Sarkari Yojana';
export const SITE_NAME_HI = 'सरकारी योजना';
export const SITE_TAGLINE = 'सरकारी योजनाओं की सरल जानकारी, पात्रता और आवेदन मार्गदर्शन।';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const PRODUCTION_SITE_URL = 'https://www.sarkariyojanasetu.com';
// Keep every public SEO and sharing URL on the verified production domain.
// Older deployments used the temporary Vercel hostname in their environment.
export const SITE_URL = (
  configuredSiteUrl && !configuredSiteUrl.includes('sarkari-yojna.vercel.app')
    ? configuredSiteUrl
    : PRODUCTION_SITE_URL
).replace(/\/+$/, '');
export const DEFAULT_OG_IMAGE = '/sarkari-yojana-map-logo.webp';
