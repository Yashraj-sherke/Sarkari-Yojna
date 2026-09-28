import {DEFAULT_OG_IMAGE, SITE_URL} from '@/lib/config';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {guides} from '@/lib/guides';
import {PageTitle} from '@/components/site';
import {allSchemes} from '@/lib/server';
import {isIndexableScheme} from '@/lib/seo';
import {isGuideRelevantToScheme} from '@/lib/guide-links';

export const revalidate = 3600;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);if(!g)notFound();return {title:g.title,description:g.description,alternates:{canonical:'/guide/'+slug},openGraph:{title:g.title,description:g.description,url:'/guide/'+slug,type:'article',locale:'hi_IN',images:[DEFAULT_OG_IMAGE]}};}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const guide = guides.find(guide => guide.slug === slug);
  if (!guide) notFound();
  const relatedSchemes = (await allSchemes()).filter(scheme =>
    isIndexableScheme(scheme) && isGuideRelevantToScheme(guide.slug, scheme)
  ).slice(0, 6);
  const otherGuides = guides.filter(item => item.slug !== guide.slug);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {name: 'होम', item: `${SITE_URL}/`},
      {name: 'सभी गाइड', item: `${SITE_URL}/guide`},
      {name: guide.title, item: `${SITE_URL}/guide/${guide.slug}`},
    ].map((item, index) => ({'@type': 'ListItem', position: index + 1, ...item})),
  };
  return <main id="main" className="page-wrap prose">
    <nav className="breadcrumb" aria-label="breadcrumb">
      <Link href="/">होम</Link><span> / </span><Link href="/guide">सभी गाइड</Link><span> / </span><span aria-current="page">{guide.title}</span>
    </nav>
    <PageTitle eyebrow={guide.category} title={guide.title} description={guide.description}/>
    {guide.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    <p className="small">यह सामान्य जानकारी है। यह किसी राज्य की पूर्ण या वर्तमान आवेदन प्रक्रिया होने का दावा नहीं करती।</p>
    {relatedSchemes.length > 0 && <section aria-labelledby="guide-schemes">
      <h2 id="guide-schemes">संबंधित योजना लेख</h2>
      <p>हर योजना की पात्रता और दस्तावेज़ अलग हो सकते हैं। आवेदन से पहले पूरा लेख और उसके सरकारी स्रोत पढ़ें।</p>
      <ul>{relatedSchemes.map(scheme => <li key={scheme.slug}><Link href={`/yojna/${scheme.slug}`}>{scheme.title}</Link></li>)}</ul>
    </section>}
    <nav aria-labelledby="more-guides">
      <h2 id="more-guides">आवेदन की तैयारी के अन्य गाइड</h2>
      <ul>{otherGuides.map(item => <li key={item.slug}><Link href={`/guide/${item.slug}`}>{item.title}</Link></li>)}</ul>
    </nav>
    <Link className="btn secondary" href="/yojna">सभी समीक्षित योजना लेख देखें →</Link>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c')}}/>
  </main>;
}
