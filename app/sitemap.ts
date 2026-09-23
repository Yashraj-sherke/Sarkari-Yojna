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
  const schemes=(await allSchemes()).filter(s=>s.status==='ACTIVE'&&!s.isSample&&s.editorial?.publicationStatus!=='DRAFT_REVIEW_REQUIRED');
  const latest=schemes.map(s=>reviewedDate(s.lastUpdated??s.verifiedAt)).sort().at(-1)??INFORMATION_UPDATED;
  const statics=[
    {url:SITE_URL,lastModified:latest},
    {url:`${SITE_URL}/praman-patr`,lastModified:INFORMATION_UPDATED},
    {url:`${SITE_URL}/guide`,lastModified:INFORMATION_UPDATED},
    {url:`${SITE_URL}/state/madhya-pradesh`,lastModified:latest},
    ...Object.keys(informationPages).map(key=>({url:`${SITE_URL}/${key}`,lastModified:INFORMATION_UPDATED})),
  ];
  const cats=categories.map(c=>{const categoryLatest=schemes.filter(s=>s.category===c.id).map(s=>reviewedDate(s.lastUpdated??s.verifiedAt)).sort().at(-1)??INFORMATION_UPDATED;return {url:`${SITE_URL}/category/${c.id}`,lastModified:categoryLatest};});
  const gs=guides.map(g=>({url:`${SITE_URL}/guide/${g.slug}`,lastModified:INFORMATION_UPDATED}));
  const ys=schemes.map(s=>({url:`${SITE_URL}/yojna/${s.slug}`,lastModified:reviewedDate(s.lastUpdated??s.verifiedAt)}));
  return [...statics,...cats,...gs,...ys];
}
