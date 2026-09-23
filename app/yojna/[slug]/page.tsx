import {notFound} from 'next/navigation';
import {BackButton} from '@/components/back-button';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {getScheme,db,allSchemes} from '@/lib/server';
import {Status,SampleNotice,Card} from '@/components/site';

import {YojnaDetailClient} from '@/components/yojna-detail-client';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
import {DEFAULT_OG_IMAGE, SITE_URL} from '@/lib/config';
export const revalidate = 3600; // 1 hour caching for blazingly fast TTFB

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) return {title:'योजना नहीं मिली',robots:{index:false,follow:false}};
  const isPublic=!!s&&!s.isSample&&s.status==='ACTIVE'&&s.editorial?.publicationStatus==='REVIEWED';
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
  const isActive=s.status==='ACTIVE'&&!s.isSample&&s.sourceUrl&&s.editorial?.publicationStatus==='REVIEWED';
  const schemesList = await allSchemes();
  const relatedSchemes = schemesList.filter(x =>
    x.category === s.category &&
    x.slug !== s.slug &&
    x.status === 'ACTIVE' &&
    !x.isSample &&
    x.editorial?.publicationStatus === 'REVIEWED'
  ).slice(0, 3);

  // GovernmentService schema
  const govServiceSchema=isActive?{
    '@context':'https://schema.org',
    '@type':'GovernmentService',
    name:s.title,
    alternateName:s.english,
    description:s.summary,
    serviceUrl:s.applicationUrl||s.sourceUrl,
    provider:{'@type':'GovernmentOrganization',name:s.department},
    areaServed:s.state==='madhya-pradesh'?'Madhya Pradesh, India':'India',
    audience:{'@type':'Audience',audienceType:s.rules.map(r=>r.label).join(', ')||'सभी पात्र नागरिक'},
  }:null;

  // BreadcrumbList schema
  const breadcrumbItems=s.state==='madhya-pradesh' ? [
    {'@type':'ListItem',position:1,name:'होम',item:`${SITE_URL}/`},
    {'@type':'ListItem',position:2,name:'मध्य प्रदेश की योजनाएं',item:`${SITE_URL}/state/madhya-pradesh`},
    {'@type':'ListItem',position:3,name:s.title,item:`${SITE_URL}/yojna/${s.slug}`},
  ] : [
    {'@type':'ListItem',position:1,name:'होम',item:`${SITE_URL}/`},
    {'@type':'ListItem',position:2,name:s.title,item:`${SITE_URL}/yojna/${s.slug}`},
  ];
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
    {govServiceSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(govServiceSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
