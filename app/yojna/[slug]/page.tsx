import {notFound} from 'next/navigation';
import {getScheme,db,allSchemes} from '@/lib/server';
import { categories } from '@/lib/domain';
import { isIndexableScheme, contentDate } from '@/lib/seo';

import {YojnaDetailClient} from '@/components/yojna-detail-client';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
import {DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL} from '@/lib/config';
export const revalidate = 3600; // 1 hour caching for blazingly fast TTFB

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) notFound();
  const isPublic=isIndexableScheme(s);
  const title=`${s.title} — लाभ, पात्रता और आवेदन प्रक्रिया`;
  const descriptionText=`${s.benefit} पात्रता, आवश्यक दस्तावेज़, आवेदन प्रक्रिया और आधिकारिक स्रोत देखें।`;
  const desc=descriptionText.length>160?`${descriptionText.slice(0,157).trimEnd()}…`:descriptionText;
  return {
    title,
    description:desc,
    alternates:{canonical:'/yojna/'+slug},
    robots:{index:isPublic,follow:true},
    openGraph:{title,description:desc,url:`${SITE_URL}/yojna/${slug}`,locale:'hi_IN',type:'article',images:[{url:DEFAULT_OG_IMAGE,alt:s.title}]},
    twitter:{card:'summary',title,description:desc,images:[DEFAULT_OG_IMAGE]},
  };
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) return notFound();
  const d=db();
  const cRes=d?await d`SELECT count(*) AS n FROM signals t JOIN sessions u ON t.session_id=u.id WHERE slug=${slug} AND u.expires_at>${new Date().toISOString()}`:[{n:0}];
  const c={n:Number(cRes[0]?.n||0)};

  const tags=getSchemeTags(s);
  const eligibilityList=getSchemeEligibilityList(s);
  const processInfo=getSchemeProcess(s);
  const faqs=getSchemeFaqs(s);

  // Build rich structured data
  const isActive=isIndexableScheme(s);
  const schemesList = await allSchemes();
  const relatedSchemes = schemesList.filter(x =>
    x.category === s.category &&
    x.slug !== s.slug &&
    isIndexableScheme(x)
  ).slice(0, 3);

  const articleSchema=isActive?{
    '@context':'https://schema.org',
    '@type':'Article',
    headline:s.title,
    description:s.summary,
    inLanguage:'hi-IN',
    mainEntityOfPage:`${SITE_URL}/yojna/${s.slug}`,
    dateModified:contentDate(s.lastUpdated ?? s.editorial?.reviewedAt),
    publisher:{'@type':'Organization','@id':`${SITE_URL}/#organization`,name:SITE_NAME_EN,url:SITE_URL},
    citation:s.references?.map(ref=>ref.url),
  }:null;
  const category = categories.find(c=>c.id===s.category);
  const breadcrumbItems=[
    {name:'होम',item:`${SITE_URL}/`},
    ...(s.state==='madhya-pradesh' ? [{name:'मध्य प्रदेश की योजनाएं',item:`${SITE_URL}/state/madhya-pradesh`}] : []),
    ...(category ? [{name:category.name,item:`${SITE_URL}/category/${category.id}`}] : []),
    {name:s.title,item:`${SITE_URL}/yojna/${s.slug}`},
  ].map((item,i)=>({'@type':'ListItem',position:i+1,...item}));
  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:breadcrumbItems
  };

  return <main id="main" className="page-wrap">
    <YojnaDetailClient 
      s={s} 
      tags={tags} 
      eligibilityList={eligibilityList} 
      processInfo={processInfo} 
      faqs={faqs} 
      relatedSchemes={relatedSchemes} 
      initialCount={c?.n??0} 
    />

    {/* Structured data for Google rich results */}
    {breadcrumbSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>}
    {articleSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
