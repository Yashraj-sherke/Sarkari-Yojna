import {notFound} from 'next/navigation';
import {getScheme,db,allSchemes} from '@/lib/server';
import { categories } from '@/lib/domain';
import { isIndexableScheme, isPublicScheme, contentDate, schemeSearchPresentation } from '@/lib/seo';
import { selectRelatedSchemes } from '@/lib/related-schemes';
import { officialImages } from '@/lib/scheme-images';

import {YojnaDetailClient} from '@/components/yojna-detail-client';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
import {getAllSamachar, getSamacharRelatedSchemeSlugs} from '@/lib/samachar';
import {DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL, AUTHOR_NAME, AUTHOR_LINKEDIN_URL} from '@/lib/config';
export const revalidate = 3600;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) { 
    return { title: 'Not Found', robots: { index: false } };
  }
  const isPublic=isIndexableScheme(s);
  const {title, description: defaultDesc}=schemeSearchPresentation(s);
  const desc = s.editorial?.verificationStatus === 'VERIFIED_CORE' ? (s.seoDescription || defaultDesc) : defaultDesc;
  const image= s.imageUrl || officialImages[s.slug]?.src || DEFAULT_OG_IMAGE;

  return {
    title: title,
    description:desc,
    alternates:{canonical:'/yojna/'+slug},
    robots:{index:isPublic,follow:true,...(isPublic ? {'max-image-preview':'large' as const} : {})},
    openGraph:{title: title,description:desc,url:`${SITE_URL}/yojna/${slug}`,siteName:SITE_NAME_EN,locale:'hi_IN',type:'article',images:[{url:image,alt:s.title}]},
    twitter:{card:'summary_large_image',title: title,description:desc,images:[image]},
  };
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s || !isPublicScheme(s)) { return notFound(); }
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
  const relatedSchemes = selectRelatedSchemes(s, schemesList);
  const relatedUpdates = (await getAllSamachar())
    .filter(update => getSamacharRelatedSchemeSlugs(update).includes(s.slug))
    .slice(0, 3)
    .map(update => ({slug: update.slug, title: update.title}));
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

  const faqSchema = faqs.length > 0 && s.editorial?.verificationStatus === 'VERIFIED_CORE' ? {
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
    '@type': 'Article',
    name: s.title,
    headline: s.title,
    description: s.summary,
    inLanguage: 'hi-IN',
    url: `${SITE_URL}/yojna/${s.slug}`,
    // No recorded first-publication date exists; do not invent one from an edit.
    dateModified: contentDate(s.lastUpdated ?? s.editorial?.reviewedAt),
    author: {
      '@type': 'Organization',
      name: AUTHOR_NAME,
      url: `${SITE_URL}/`,
      ...(AUTHOR_LINKEDIN_URL ? { sameAs: [AUTHOR_LINKEDIN_URL] } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME_EN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-192.png`
      }
    },
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
      relatedSchemes={relatedSchemes}
      relatedUpdates={relatedUpdates}
      initialCount={c?.n??0} 
    />

    {/* Structured data for Google rich results */}
    {breadcrumbSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>}
    {webPageSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webPageSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
