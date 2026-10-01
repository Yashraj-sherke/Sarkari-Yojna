import {notFound} from 'next/navigation';
import {getScheme,db,allSchemes} from '@/lib/server';
import { categories } from '@/lib/domain';
import { isIndexableScheme, contentDate, schemeSearchPresentation } from '@/lib/seo';
import { officialImages } from '@/lib/scheme-images';

import {YojnaDetailClient} from '@/components/yojna-detail-client';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
import {DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL} from '@/lib/config';
export const revalidate = 3600; // 1 hour caching for blazingly fast TTFB

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) notFound();
  const isPublic=isIndexableScheme(s);
  const {title, description: defaultDesc}=schemeSearchPresentation(s);
  const desc = s.seoDescription || defaultDesc;
  const image= s.imageUrl || officialImages[s.slug]?.src || DEFAULT_OG_IMAGE;

  return {
    title: title,
    description:desc,
    alternates:{canonical:'/yojna/'+slug},
    robots:{index:isPublic,follow:true,...(isPublic ? {maxImagePreview:'large' as const} : {})},
    openGraph:{title: title,description:desc,url:`${SITE_URL}/yojna/${slug}`,siteName:SITE_NAME_EN,locale:'hi_IN',type:'article',images:[{url:image,alt:s.title}]},
    twitter:{card:'summary_large_image',title: title,description:desc,images:[image]},
  };
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s || (s.status !== 'ACTIVE' && s.status !== 'CLOSED' && s.status !== 'ARCHIVED')) return notFound();
  const d=db();
  // Feedback is optional: database downtime must not make the article unavailable.
  const cRes=d?await d`SELECT count(*) AS n FROM signals t JOIN sessions u ON t.session_id=u.id WHERE slug=${slug} AND u.expires_at>${new Date().toISOString()}`.catch(()=>[{n:0}]):[{n:0}];
  const c={n:Number(cRes[0]?.n||0)};

  const tags=getSchemeTags(s);
  const eligibilityList=getSchemeEligibilityList(s);
  const processInfo=getSchemeProcess(s);
  const faqs=getSchemeFaqs(s);

  // Build rich structured data
  const isActive=isIndexableScheme(s);
  const schemesList = await allSchemes();
  const relatedSchemes = schemesList.filter(x => x.category === s.category && x.slug !== s.slug && isIndexableScheme(x)).sort((a, b) => Number(b.state === s.state) - Number(a.state === s.state)).slice(0, 3);
  const relatedSchemesMapped = relatedSchemes.map(rs => ({
    slug: rs.slug,
    title: rs.title,
    english: rs.english,
  }));
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

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  } : null;

  const webPageSchema = isActive ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: s.title,
    description: s.summary,
    inLanguage: 'hi-IN',
    url: `${SITE_URL}/yojna/${s.slug}`,
    dateModified: contentDate(s.lastUpdated ?? s.editorial?.reviewedAt),
    about: { '@type': 'Thing', name: s.title },
    citation: s.references?.map(reference => reference.url),
  } : null;

  return <main id="main" className="page-wrap">
    <YojnaDetailClient 
      s={s} 
      tags={tags} 
      eligibilityList={eligibilityList} 
      processInfo={processInfo} 
      faqs={faqs} 
      relatedSchemes={relatedSchemesMapped as any} 
      initialCount={c?.n??0} 
    />

    {/* Structured data for Google rich results */}
    {breadcrumbSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>}
    {webPageSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webPageSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
