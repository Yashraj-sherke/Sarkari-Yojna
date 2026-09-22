import {notFound} from 'next/navigation';
import {BackButton} from '@/components/back-button';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {getScheme,db,allSchemes} from '@/lib/server';
import {Status,SampleNotice,Card} from '@/components/site';

import {YojnaDetailClient} from '@/components/yojna-detail-client';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
export const revalidate = 3600; // 1 hour caching for blazingly fast TTFB

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) return {title:'योजना नहीं मिली'};
  const isPublic=!!s&&!s.isSample&&s.status==='ACTIVE';
  // Rich keyword-packed title for Google
  const title=`${s.title} 2026 – आवेदन, पात्रता, लाभ, स्टेटस`;
  // Rich description mentioning benefit + key docs
  const desc=`${s.title} के तहत सभी पात्र लाभार्थियों को लाभ मिलता है। इस पृष्ठ पर जानें पात्रता, लाभ, दस्तावेज़, आवेदन प्रक्रिया और स्टेटस कैसे चेक करें।`;
  return {
    title,
    description:desc,
    keywords:[s.title,s.english,s.department,'सरकारी योजना',s.state==='madhya-pradesh'?'मध्य प्रदेश योजना':'केंद्र सरकार योजना','पात्रता','दस्तावेज़','आवेदन','praman patr','sarkari yojana',s.benefit],
    alternates:{
      canonical:'/yojna/'+slug,
      languages: {
        'hi': '/yojna/'+slug,
        'en': '/yojna/'+slug,
      }
    },
    robots:{index:isPublic,follow:true},
    openGraph:{title,description:s.summary,locale:'hi_IN',type:'article'},
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
  const isActive=s.status==='ACTIVE'&&!s.isSample&&s.sourceUrl;
  const schemesList = await allSchemes();
  const relatedSchemes = schemesList.filter(x => x.category === s.category && x.slug !== s.slug).slice(0, 3);

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

  // HowTo schema for application steps
  const howToSchema=isActive&&s.steps.length?{
    '@context':'https://schema.org',
    '@type':'HowTo',
    name:`${s.title} में आवेदन कैसे करें`,
    description:`${s.title} के लिए आवेदन की तैयारी कैसे करें — दस्तावेज़ और प्रक्रिया।`,
    step:s.steps.map((step,i)=>({'@type':'HowToStep',position:i+1,name:`चरण ${i+1}`,text:step})),
    tool:s.documents.map(d=>({'@type':'HowToTool',name:d.replace(/^[\p{Emoji}\s]+/u,'')})),
  }:null;

  // FAQPage schema
  const faqSchema=isActive&&faqs.length?{
    '@context':'https://schema.org',
    '@type':'FAQPage',
    mainEntity:faqs.map(f=>({
      '@type':'Question',
      name:f.q,
      acceptedAnswer:{
        '@type':'Answer',
        text:f.a,
      },
    })),
  }:null;

  // BreadcrumbList schema
  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:'https://sarkariyojanasetu.com/'},
      {'@type':'ListItem',position:2,name: s.state === 'madhya-pradesh' ? 'मध्य प्रदेश की योजनाएं' : 'योजनाएं',item: s.state === 'madhya-pradesh' ? 'https://sarkariyojanasetu.com/state/madhya-pradesh' : 'https://sarkariyojanasetu.com/'},
      {'@type':'ListItem',position:3,name:s.title,item:`https://sarkariyojanasetu.com/yojna/${s.slug}`},
    ]
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
    {howToSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howToSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
