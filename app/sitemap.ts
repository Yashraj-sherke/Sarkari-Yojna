import {allSchemes} from '@/lib/server';
import {categories} from '@/lib/domain';
import {guides} from '@/lib/guides';
export const dynamic='force-dynamic';
export default async function sitemap(){const base='https://sarkari-yojna-navigator.ombhayde.chatgpt.site';const schemes=await allSchemes();return ['','/guide','/privacy','/terms','/disclaimer','/state/madhya-pradesh',...categories.map(c=>'/category/'+c.id),...guides.map(g=>'/guide/'+g.slug),...schemes.filter(s=>!s.isSample&&s.status==='ACTIVE').map(s=>'/yojna/'+s.slug)].map(p=>({url:base+p}));}
