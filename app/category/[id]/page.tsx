import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {categories} from '@/lib/domain';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
import { SchemeIndex } from '@/components/scheme-index';
import { isIndexableScheme } from '@/lib/seo';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export async function generateMetadata({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const category=categories.find(c=>c.id===id);
  if(!category) notFound();
  const schemes=await allSchemes();
  const indexable=schemes.some(s=>s.category===id&&isIndexableScheme(s));
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
      locale:'hi_IN',
    images:[DEFAULT_OG_IMAGE]
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

  const schemes = await allSchemes();
  const reviewedSchemes=schemes.filter(s=>s.category===id&&isIndexableScheme(s));
  const collectionSchema={
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    '@id':`${SITE_URL}/category/${id}#collection`,
    name:`${category.name} की सरकारी योजनाएं`,
    inLanguage:'hi-IN',
    mainEntity:{
      '@type':'ItemList',
      numberOfItems:reviewedSchemes.length,
      itemListElement:reviewedSchemes.map((scheme,index)=>({'@type':'ListItem',position:index+1,name:scheme.title,url:`${SITE_URL}/yojna/${scheme.slug}`})),
    },
  };
  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} initialCategory={id}/>
      <SchemeIndex schemes={schemes.filter(s => s.category === id)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
