import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {categories} from '@/lib/domain';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
import { SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export async function generateMetadata({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const category=categories.find(c=>c.id===id);
  if(!category)return {title:'श्रेणी नहीं मिली',robots:{index:false}};
  const schemes=await allSchemes();
  const indexable=schemes.some(s=>s.category===id&&s.status==='ACTIVE'&&!s.isSample&&s.editorial?.publicationStatus==='REVIEWED');
  const title=`${category.name} की सरकारी योजनाएं`;
  const description=`${category.name} से जुड़ी केंद्र और मध्य प्रदेश सरकार की योजनाओं के लाभ, पात्रता, दस्तावेज़ और आवेदन जानकारी देखें।`;
  return {
    title,
    description,
    alternates:{canonical:'/category/'+id},
    robots:{index:indexable,follow:true},
    openGraph:{
      title,
      description,
      url:'/category/'+id,
      type:'website',
      locale:'hi_IN'
    }
  };
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const category=categories.find(c=>c.id===id);
  if(!category)notFound();

  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:`${SITE_URL}/`},
      {'@type':'ListItem',position:2,name:category.name,item:`${SITE_URL}/category/${id}`},
    ]
  };

  return (
    <>
      <Directory schemes={(await allSchemes()).map(summarizeScheme)} initialCategory={id}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
