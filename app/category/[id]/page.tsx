import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {categories} from '@/lib/domain';
import {allSchemes} from '@/lib/server';
import {getAllSamachar, getSamacharRelatedSchemeSlugs} from '@/lib/samachar';
import {Directory} from '@/components/directory';
import { SchemeIndex } from '@/components/scheme-index';
import { isIndexableScheme } from '@/lib/seo';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/config';
import { DiscoveryIndex } from '@/components/discovery-index';

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

export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{page?:string}>}){
  const {id}=await params;
  const page=Math.max(1,Number.parseInt((await searchParams).page??'1',10)||1);
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
  
  // Phase 25: Latest updates for this category
  const allUpdates = await getAllSamachar();
  const categoryUpdates = allUpdates.filter(u => {
    const related = getSamacharRelatedSchemeSlugs(u);
    return related.some(slug => schemes.find(s => s.slug === slug)?.category === id);
  }).slice(0, 5);

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
  let pillarContent = null;
  if (id === 'kisan') {
    pillarContent = (
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>
          किसानों के लिए प्रमुख सरकारी योजनाएं
        </h2>
        <p style={{ color: '#15803d', fontSize: '1.05rem', marginBottom: '16px' }}>
          भारत और मध्य प्रदेश सरकार किसानों की आय बढ़ाने, खेती की लागत कम करने और प्राकृतिक आपदाओं से फसल सुरक्षा के लिए कई लाभकारी योजनाएं चला रही हैं। यहाँ आपको सभी महत्वपूर्ण कृषि योजनाओं की जानकारी मिलेगी।
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
            <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>आर्थिक सहायता (DBT)</h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>PM Kisan और मुख्यमंत्री किसान कल्याण योजना के तहत किसानों को हर साल ₹12,000 तक की सीधी आर्थिक सहायता दी जाती है।</p>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
            <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>फसल बीमा एवं उपकरण</h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>PM फसल बीमा योजना से नुकसान की भरपाई और सोलर पंप, सिंचाई उपकरण आदि पर भारी सब्सिडी उपलब्ध है।</p>
          </div>
        </div>
      </div>
    );
  } else {
    pillarContent = (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
          {category.name} की योजनाएं
        </h2>
        <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '16px' }}>
          यहाँ आप {category.name} से जुड़ी सभी सरकारी योजनाओं की सूची देख सकते हैं। केंद्र और राज्य सरकार द्वारा नागरिकों को सीधा लाभ पहुँचाने के लिए कई कल्याणकारी योजनाएं चलाई जा रही हैं। 
        </p>
        <p style={{ fontSize: '0.95rem', color: '#475569' }}>
          नीचे दी गई सूची में अपनी जरूरत के अनुसार योजना चुनें और पात्रता, आवश्यक दस्तावेज़, तथा आवेदन प्रक्रिया की पूरी जानकारी सरल हिन्दी में प्राप्त करें।
        </p>
      </div>
    );
  }

  return (
    <>
      <Directory 
        schemes={schemes.map(summarizeScheme)} 
        initialCategory={id} 
        initialPage={page} 
        paginationBasePath={`/category/${id}`}
        latestNews={categoryUpdates}
        pillarContent={pillarContent}
      />
      <DiscoveryIndex schemes={schemes} />
      <SchemeIndex schemes={schemes.filter(s => s.category === id)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
