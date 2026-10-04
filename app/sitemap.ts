import {stateNames} from '@/lib/state-names';
import type {MetadataRoute} from 'next';
import {allSchemes} from '@/lib/server';
import {categories} from '@/lib/domain';
import {guides} from '@/lib/guides';
import {isIndexableScheme, contentDate} from '@/lib/seo';
import {SITE_URL} from '@/lib/config';
import {INFORMATION_UPDATED, informationPages} from '@/lib/information-pages';
import {getAllSamachar, samacharQuality} from '@/lib/samachar';
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap>{
  const schemes=(await allSchemes()).filter(isIndexableScheme);
  const updates=(await getAllSamachar()).filter(update => samacharQuality(update).publishable);
  const latest=schemes.map(s=>contentDate(s.lastUpdated??s.editorial?.reviewedAt)).filter((date): date is string => Boolean(date)).sort().at(-1);
  const reviewedStates = Object.keys(stateNames).filter(state => state !== 'central' && schemes.some(s => s.state === state));

  const statics: MetadataRoute.Sitemap = [
    {url:SITE_URL,lastModified:latest},
    {url:`${SITE_URL}/yojna`,lastModified:latest},
    ...reviewedStates.map(state => ({url:`${SITE_URL}/state/${state}`,lastModified:schemes.filter(s => s.state === state).map(s => contentDate(s.lastUpdated ?? s.editorial?.reviewedAt)).filter((date): date is string => Boolean(date)).sort().at(-1)})),
    {url:`${SITE_URL}/guide`},
    ...updates.map(update => ({url:`${SITE_URL}/samachar/${update.slug}`,lastModified:contentDate(update.date)})),
    ...Object.keys(informationPages).map(key=>({
      url:`${SITE_URL}/${key}`,
      lastModified:INFORMATION_UPDATED
    })),
  ];

  const cats: MetadataRoute.Sitemap = categories.filter(c=>schemes.some(s=>s.category===c.id)).map(c=>{
    const categoryLatest=schemes.filter(s=>s.category===c.id).map(s=>contentDate(s.lastUpdated??s.editorial?.reviewedAt)).filter((date): date is string => Boolean(date)).sort().at(-1);
    return {url:`${SITE_URL}/category/${c.id}`,lastModified:categoryLatest};
  });

  const gs: MetadataRoute.Sitemap = guides.map(g=>({
    url:`${SITE_URL}/guide/${g.slug}`
  }));

  const ys: MetadataRoute.Sitemap = schemes.map(s=>({
    url:`${SITE_URL}/yojna/${s.slug}`,
    lastModified:contentDate(s.lastUpdated??s.editorial?.reviewedAt)
  }));

  return [...statics,...cats,...gs,...ys];
}
