import Link from 'next/link';
import {DeleteData} from './personal';
import {CONTACT_EMAIL, INFORMATION_UPDATED, informationPages, type InformationPageKey} from '@/lib/information-pages';
import {SITE_NAME_HI, SITE_URL} from '@/lib/config';

export function InformationPage({page}: {page: InformationPageKey}) {
  const content = informationPages[page];
  const structured = {'@context':'https://schema.org','@type':page === 'about' ? 'AboutPage' : page === 'contact' ? 'ContactPage' : 'WebPage',name:content.title,description:content.description,url:`${SITE_URL}/${page}`,inLanguage:'hi-IN',dateModified:INFORMATION_UPDATED,isPartOf:{'@type':'WebSite',name:SITE_NAME_HI,url:SITE_URL}};
  return <main id="main" className="page-wrap prose">
    <nav aria-label="ब्रेडक्रंब"><Link href="/">मुख्य पृष्ठ</Link> / <span>{content.title}</span></nav>
    <header className="page-heading" style={{marginTop:24}}><p className="eyebrow green-text">{SITE_NAME_HI} · जानकारी और नीतियाँ</p><h1>{content.title}</h1><p>{content.intro}</p><small>अंतिम संशोधन: <time dateTime={INFORMATION_UPDATED}>23 सितंबर 2026</time></small></header>
    {page === 'contact' && <div className="panel"><h2>हमारा संपर्क ईमेल</h2><a href={`mailto:${CONTACT_EMAIL}`} style={{overflowWrap:'anywhere',fontWeight:600}}>{CONTACT_EMAIL}</a><p>ईमेल लिंक खोलने से आपके मेल ऐप में संदेश तैयार होता है। आपकी अनुमति के बिना संदेश नहीं भेजा जाता।</p></div>}
    {content.sections.map((section,i) => <section key={section.title} aria-labelledby={`info-${i}`} style={{marginTop:32}}><h2 id={`info-${i}`}>{section.title}</h2>{'paragraphs' in section && section.paragraphs?.map(p=><p key={p}>{p}</p>)}{'items' in section && section.items && <ul>{section.items.map(p=><li key={p}>{p}</li>)}</ul>}{page === 'privacy' && i === 4 && <DeleteData/>}</section>)}
    <aside className="panel" style={{marginTop:36}}><h2>सवाल या सुधार भेजें</h2><p><a href={`mailto:${CONTACT_EMAIL}`} style={{overflowWrap:'anywhere'}}>{CONTACT_EMAIL}</a></p><nav aria-label="संबंधित जानकारी" style={{display:'flex',flexWrap:'wrap',gap:'12px 24px'}}>{Object.entries(informationPages).filter(([key])=>key!==page).map(([key,value])=><Link key={key} href={`/${key}`}>{value.title}</Link>)}</nav></aside>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/>
  </main>;
}
