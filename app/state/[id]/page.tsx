import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
import { SchemeIndex } from '@/components/scheme-index';
import { isIndexableScheme } from '@/lib/seo';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export async function generateMetadata({params}:{params:Promise<{id:string}>}){
  if ((await params).id !== 'madhya-pradesh') notFound();
  const schemes=await allSchemes();
  const indexable=schemes.some(s=>s.state==='madhya-pradesh'&&isIndexableScheme(s));
  return {
  title:'मध्य प्रदेश की सरकारी योजनाएं',
  description:'मध्य प्रदेश सरकार की योजनाओं के लाभ, पात्रता, दस्तावेज़, आवेदन प्रक्रिया और आधिकारिक स्रोत देखें।',
  alternates:{canonical:'/state/madhya-pradesh'},
  robots:{index:indexable,follow:true},
  openGraph:{
    title:'मध्य प्रदेश की सरकारी योजनाएं',
    description:'मध्य प्रदेश सरकार की योजनाओं की सरल हिन्दी जानकारी।',
    url:'/state/madhya-pradesh',
    type:'website' as const,
    locale:'hi_IN',
    images:[DEFAULT_OG_IMAGE]
  }
  };
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  if(id!=='madhya-pradesh')notFound();

  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:`${SITE_URL}/`},
      {'@type':'ListItem',position:2,name:'मध्य प्रदेश की योजनाएं',item:`${SITE_URL}/state/madhya-pradesh`},
    ]
  };

  const schemes = await allSchemes();
  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} initialState={id}/>
      <SchemeIndex schemes={schemes.filter(s => s.state === id)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
