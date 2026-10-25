import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    // One group avoids crawler-specific Allow rules overriding shared exclusions.
    // Admin/utility HTML remains crawlable so crawlers can read its noindex.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/out/'] }],
    sitemap:`${SITE_URL}/sitemap.xml`,
  };
}
