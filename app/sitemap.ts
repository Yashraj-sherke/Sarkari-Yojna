import type {MetadataRoute} from 'next';
import {allSchemes} from '@/lib/server';
import {categories} from '@/lib/domain';
import {guides} from '@/lib/guides';
import {SITE_URL} from '@/lib/config';
import {INFORMATION_UPDATED, informationPages} from '@/lib/information-pages';
export const revalidate = 86400;

function reviewedDate(value?: string | null) {
  if (!value) return INFORMATION_UPDATED;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? INFORMATION_UPDATED : date.toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap>{
  const schemes=(await allSchemes()).filter(s=>s.status==='ACTIVE'&&!s.isSample&&s.editorial?.publicationStatus==='REVIEWED');
  const latest=schemes.map(s=>reviewedDate(s.editorial?.reviewedAt??s.lastUpdated??s.verifiedAt)).sort().at(-1)??INFORMATION_UPDATED;
  const hasReviewedMpScheme=schemes.some(s=>s.state==='madhya-pradesh');

  const statics: MetadataRoute.Sitemap = [
    {url:SITE_URL,lastModified:latest},
    ...(hasReviewedMpScheme ? [{url:`${SITE_URL}/state/madhya-pradesh`,lastModified:latest}] : []),
    {url:`${SITE_URL}/guide`,lastModified:INFORMATION_UPDATED},
    ...Object.keys(informationPages).map(key=>({
      url:`${SITE_URL}/${key}`,
      lastModified:INFORMATION_UPDATED
    })),
  ];

  const cats: MetadataRoute.Sitemap = categories.filter(c=>schemes.some(s=>s.category===c.id)).map(c=>{
    const categoryLatest=schemes.filter(s=>s.category===c.id).map(s=>reviewedDate(s.editorial?.reviewedAt??s.lastUpdated??s.verifiedAt)).sort().at(-1)??INFORMATION_UPDATED;
    return {url:`${SITE_URL}/category/${c.id}`,lastModified:categoryLatest};
  });

  const gs: MetadataRoute.Sitemap = guides.map(g=>({
    url:`${SITE_URL}/guide/${g.slug}`,
    lastModified:INFORMATION_UPDATED
  }));

  const ys: MetadataRoute.Sitemap = schemes.map(s=>({
    url:`${SITE_URL}/yojna/${s.slug}`,
    lastModified:reviewedDate(s.editorial?.reviewedAt??s.lastUpdated??s.verifiedAt)
  }));

  return [...statics,...cats,...gs,...ys];
}
