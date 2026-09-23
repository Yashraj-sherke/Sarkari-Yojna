export const SITE_NAME_EN = 'Sarkari Yojana';
export const SITE_NAME_HI = 'सरकारी योजना';
export const SITE_TAGLINE = 'सरकारी योजनाओं की सरल जानकारी, पात्रता और आवेदन मार्गदर्शन।';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
export const SITE_URL = (configuredSiteUrl || 'https://sarkari-yojna.vercel.app').replace(/\/+$/, '');
export const DEFAULT_OG_IMAGE = '/sarkari-yojana-map-logo.webp';
