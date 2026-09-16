import {notFound} from 'next/navigation';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {getScheme,db} from '@/lib/server';
import {PageTitle,Status,SampleNotice} from '@/components/site';
import {SchemeActions} from '@/components/scheme-actions';
export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s) return {title:'योजना नहीं मिली'};
  const isPublic=!!s&&!s.isSample&&s.status==='ACTIVE';
  // Rich keyword-packed title for Google
  const title=`${s.title} — पात्रता, दस्तावेज़ और आवेदन प्रक्रिया`;
  // Rich description mentioning benefit + key docs
  const desc=`${s.title}: ${s.summary} | लाभ: ${s.benefit} | विभाग: ${s.department} | दस्तावेज़, पात्रता और आवेदन की पूरी जानकारी हिन्दी में।`;
  return {
    title,
    description:desc,
    keywords:[s.title,s.english,s.department,'सरकारी योजना',s.state==='madhya-pradesh'?'मध्य प्रदेश योजना':'केंद्र सरकार योजना','पात्रता','दस्तावेज़','आवेदन','praman patr','sarkari yojana',s.benefit],
    alternates:{canonical:'/yojna/'+slug},
    robots:{index:isPublic,follow:true},
    openGraph:{title,description:s.summary,locale:'hi_IN',type:'article'},
  };
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await getScheme(slug);
  if(!s)notFound();
  const d=db();
  const c=d?await d.prepare('SELECT count(*) AS n FROM signals t JOIN sessions u ON t.session_id=u.id WHERE slug=? AND u.expires_at>?').bind(slug,new Date().toISOString()).first<{n:number}>():{n:0};

  // Build rich structured data
  const isActive=s.status==='ACTIVE'&&!s.isSample&&s.sourceUrl;

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
  const faqSchema=isActive?{
    '@context':'https://schema.org',
    '@type':'FAQPage',
    mainEntity:[
      {
        '@type':'Question',
        name:`${s.title} के लिए कौन पात्र है?`,
        acceptedAnswer:{'@type':'Answer',text:s.rules.length?s.rules.map(r=>r.label).join('; '):s.sourceNotes},
      },
      {
        '@type':'Question',
        name:`${s.title} में क्या लाभ मिलता है?`,
        acceptedAnswer:{'@type':'Answer',text:s.benefit},
      },
      {
        '@type':'Question',
        name:`${s.title} के लिए कौन-से दस्तावेज़ चाहिए?`,
        acceptedAnswer:{'@type':'Answer',text:s.documents.map(d=>d.replace(/^[\p{Emoji}\s]+/u,'')).join(', ')},
      },
      ...(s.applicationUrl?[{
        '@type':'Question',
        name:`${s.title} में आवेदन कैसे करें?`,
        acceptedAnswer:{'@type':'Answer',text:`आवेदन के लिए ${new URL(s.applicationUrl).hostname} पर जाएं। ${s.steps[0]??''}`},
      }]:[]),
    ],
  }:null;

  return <main id="main" className="page-wrap">
    <Link className="small inline-link" href="/">← योजनाएं खोजें</Link>
    <PageTitle
      eyebrow={s.state==='central'?'केंद्र सरकार · '+s.english:'मध्य प्रदेश · '+s.english}
      title={s.title}
      description={s.summary}
    />
    <div style={{marginBottom:20}}><Status s={s}/></div>
    {s.isSample&&<SampleNotice/>}
    {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&<div className="sample-note">इस योजना की स्थिति बदल चुकी है या दोबारा समीक्षा जरूरी है। आवेदन से पहले सरकारी स्रोत पर पुष्टि करें।</div>}
    <div className="detail-grid">
      <div className="detail-body">
        <OfficialImage slug={s.slug} scheme={s}/>
        <section className="panel" id="labh">
          <h2>एक नज़र में</h2>
          <p><b>क्या लाभ मिल सकता है?</b><br/>{s.benefit}</p>
          <p><b>किस विभाग से जुड़ी है?</b><br/>{s.department}</p>
        </section>
        <section className="panel" id="patrata">
          <h2>कौन आवेदन कर सकता है?</h2>
          <p>इस योजना का लाभ लेने के लिए कुछ ज़रूरी शर्तें पूरी करनी होंगी।</p>
          {s.rules.length?<ul>{s.rules.map((r,i)=><li key={i}>{r.label}</li>)}</ul>:<p>पूरी पात्रता की जानकारी अभी उपलब्ध नहीं है।</p>}
          <p>ये नियम अधूरे हो सकते हैं। अपवादों सहित अंतिम पात्रता संबंधित विभाग तय करता है।</p>
          <Link className="btn secondary" href="/mere-liye">मेरी स्थिति से मिलान करें →</Link>
        </section>
        <section className="panel" id="documents">
          <h2>कौन-से दस्तावेज़ चाहिए?</h2>
          <ul>{s.documents.map((d,i)=><li key={i}>{d}</li>)}</ul>
        </section>
        <section className="panel" id="steps">
          <h2>आवेदन की तैयारी कैसे करें?</h2>
          <ol>{s.steps.map((d,i)=><li key={i}>{d}</li>)}</ol>
        </section>
        <section className="panel" id="source">
          <h2>स्रोत और समीक्षा</h2>
          <p>{s.sourceNotes}</p>
          <p>पिछला सत्यापन: {s.verifiedAt?new Date(s.verifiedAt).toLocaleDateString('hi-IN'):'अभी सत्यापित नहीं'}</p>
          <p>अगली समीक्षा: {s.nextReviewAt?new Date(s.nextReviewAt).toLocaleDateString('hi-IN'):'प्रथम सत्यापन बाकी'}</p>
          {s.sourceUrl?<a className="inline-link" href={'/out/'+s.slug+'?kind=source'} target="_blank" rel="noopener noreferrer">{new URL(s.sourceUrl).hostname} ↗</a>:<p>सरकारी स्रोत का लिंक अभी नहीं मिला है।</p>}
        </section>
      </div>
      <aside className="detail-aside"><SchemeActions s={s} initialCount={c?.n??0}/></aside>
    </div>
    {/* Structured data for Google rich results */}
    {govServiceSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(govServiceSchema).replace(/</g,'\\u003c')}}/>}
    {howToSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howToSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
