import {allSchemes} from '@/lib/server';
import {categories} from '@/lib/domain';
import {guides} from '@/lib/guides';
export const dynamic='force-dynamic';
const B='https://sarkariyojnasetu.com';
export default async function sitemap(){
  const schemes=await allSchemes();const now=new Date().toISOString();
  const statics=[
    {url:B,lastModified:now,changeFrequency:'daily',priority:1.0},
    {url:`${B}/praman-patr`,lastModified:now,changeFrequency:'weekly',priority:0.9},
    {url:`${B}/guide`,lastModified:now,changeFrequency:'weekly',priority:0.8},
    {url:`${B}/state/madhya-pradesh`,lastModified:now,changeFrequency:'weekly',priority:0.8},
    {url:`${B}/mere-liye`,lastModified:now,changeFrequency:'weekly',priority:0.7},
    {url:`${B}/privacy`,lastModified:now,changeFrequency:'monthly',priority:0.3},
    {url:`${B}/terms`,lastModified:now,changeFrequency:'monthly',priority:0.3},
    {url:`${B}/disclaimer`,lastModified:now,changeFrequency:'monthly',priority:0.3},
  ];
  const cats=categories.map(c=>({url:`${B}/category/${c.id}`,lastModified:now,changeFrequency:'daily' as const,priority:0.8}));
  const gs=guides.map(g=>({url:`${B}/guide/${g.slug}`,lastModified:now,changeFrequency:'monthly' as const,priority:0.7}));
  const ys=schemes.map(s=>{const freq: 'weekly' | 'monthly' = s.status==='ACTIVE'?'weekly':'monthly';return {url:`${B}/yojna/${s.slug}`,lastModified:now,changeFrequency:freq,priority:s.status==='ACTIVE'&&!s.isSample?0.9:0.5};});
  return [...statics,...cats,...gs,...ys];
}
