import {notFound} from 'next/navigation';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {getScheme,db} from '@/lib/server';
import {Status,SampleNotice} from '@/components/site';
import {SchemeActions} from '@/components/scheme-actions';
import {getSchemeTags,getSchemeEligibilityList,getSchemeProcess,getSchemeFaqs} from '@/lib/scheme-details';
export const dynamic='force-dynamic';

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

  const tags=getSchemeTags(s);
  const eligibilityList=getSchemeEligibilityList(s);
  const processInfo=getSchemeProcess(s);
  const faqs=getSchemeFaqs(s);

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
      {'@type':'ListItem',position:1,name:'होम',item:'https://sarkari-yojna-navigator.ombhayde.chatgpt.site/'},
      {'@type':'ListItem',position:2,name:'योजनाएं',item:'https://sarkari-yojna-navigator.ombhayde.chatgpt.site/'},
      {'@type':'ListItem',position:3,name:s.title,item:`https://sarkari-yojna-navigator.ombhayde.chatgpt.site/yojna/${s.slug}`},
    ]
  };

  return <main id="main" className="page-wrap">
    <nav aria-label="breadcrumb" className="breadcrumb-nav" style={{marginBottom:'20px', fontSize:'0.9rem', color:'#718096'}}>
      <Link href="/" className="inline-link">होम</Link> &gt; <Link href="/" className="inline-link">योजनाएं</Link> &gt; <span style={{color:'#2d3748', fontWeight:500}}>{s.title}</span>
    </nav>

    {/* Header: Title, English Subtitle, Tags, and 'पात्रता की जाँच करें' CTA */}
    <div className="yojna-header">
      <h1 className="yojna-title" style={{fontSize:'2.2rem', color:'#111', fontWeight:'700'}}>{s.title}</h1>
      
      <div className="yojna-tags-row" style={{marginTop:'15px', marginBottom:'15px'}}>
        {tags.map((tag,idx)=>(
          <span key={idx} className="yojna-tag-pill-outline">{tag}</span>
        ))}
      </div>

      <div className="yojna-check-wrap">
        <Link href={'/mere-liye?slug='+s.slug} className="yojna-check-btn-outline">
          पात्रता की जाँच करें
        </Link>
      </div>
    </div>

    <div style={{marginBottom:20}}><Status s={s}/></div>
    {s.isSample&&<SampleNotice/>}
    {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&(
      <div className="sample-note">इस योजना की स्थिति बदल चुकी है या दोबारा समीक्षा जरूरी है। आवेदन से पहले सरकारी स्रोत पर पुष्टि करें।</div>
    )}

    <div className="detail-grid">
      {/* 1. Left Navigation */}
      <aside className="detail-left-sidebar">
        <nav className="detail-left-nav">
          <a href="#vivaran" className="nav-link active">विवरण</a>
          <a href="#labh" className="nav-link">लाभ</a>
          <a href="#patrata" className="nav-link">पात्रता</a>
          <a href="#apvad" className="nav-link">अपवाद</a>
          <a href="#aavedan" className="nav-link">आवेदन प्रक्रिया</a>
          <a href="#dastavej" className="nav-link">आवश्यक दस्तावेज़</a>
          <a href="#faqs" className="nav-link">अधिकतर पूछे जाने वाले सवाल</a>
          <a href="#sandarbh" className="nav-link">स्रोत और संदर्भ</a>
          <a href="#feedback" className="nav-link">प्रतिपुष्टि</a>
        </nav>
      </aside>

      {/* 2. Main Content Body */}
      <div className="detail-body">
        <OfficialImage slug={s.slug} scheme={s}/>

        {/* 1. विवरण */}
        <section className="flat-section" id="vivaran">
          <h2 className="flat-section-heading">विवरण</h2>
          {s.detailedDescription ? (
            s.detailedDescription.map((p, idx) => <p key={idx} style={{marginBottom:'1em'}}>{p}</p>)
          ) : (
            <p>{s.summary}</p>
          )}
        </section>

        {/* 2. लाभ */}
        <section className="flat-section" id="labh">
          <h2 className="flat-section-heading">लाभ</h2>
          {s.benefitsList && s.benefitsList.length > 0 ? (
            s.benefitsList.map((b, i) => (
              <div key={i} style={{marginBottom:15}}>
                <h3 style={{fontSize:'1.1rem', fontWeight:600, marginBottom:8, color:'#2d3748'}}>{b.heading}</h3>
                <ul className="flat-list">
                  {b.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            ))
          ) : (
            <ul className="flat-list">
              <li>{s.benefit}</li>
              <li>लाभ सीधे लाभार्थी के आधार-लिंक DBT बैंक खाते में अंतरित किया जाता है।</li>
            </ul>
          )}
        </section>

        {/* 3. पात्रता */}
        <section className="flat-section" id="patrata">
          <h2 className="flat-section-heading">पात्रता</h2>
          {s.eligibilityDescription ? (
            <ul className="flat-list">
              {s.eligibilityDescription.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <ol className="flat-list">
              {eligibilityList.map((item,idx)=>{
                const cleanText=item.replace('(या)','').trim();
                return <li key={idx}>{cleanText} {item.includes('(या)')&&<span style={{color:'#718096'}}>(या)</span>}</li>;
              })}
            </ol>
          )}
        </section>

        {/* 4. अपवाद */}
        <section className="flat-section" id="apvad">
          <h2 className="flat-section-heading">अपवाद</h2>
          {s.exclusions && s.exclusions.length > 0 ? (
            <ul className="flat-list">
              {s.exclusions.map((exc, idx) => <li key={idx}>{exc}</li>)}
            </ul>
          ) : (
            <ol className="flat-list">
              <li>कोई विशिष्ट अपवाद उपलब्ध नहीं है। कृपया विस्तृत जानकारी के लिए आधिकारिक स्रोत देखें।</li>
            </ol>
          )}
        </section>

        {/* 5. आवेदन प्रक्रिया */}
        <section className="flat-section" id="aavedan">
          <h2 className="flat-section-heading">आवेदन प्रक्रिया</h2>
          
          {s.applicationProcess && s.applicationProcess.length > 0 ? (
            <div>
              {s.applicationProcess.map((proc, i) => (
                <div key={i} style={{marginBottom:20}}>
                  <div className="tabs-header" style={{borderBottom:'2px solid #e2e8f0', marginBottom:15}}>
                    <button className="tab-btn active" style={{borderBottom:'2px solid #3182ce', color:'#3182ce', background:'none', border:'none', padding:'8px 16px', fontWeight:600}}>{proc.mode}</button>
                  </div>
                  <ol className="flat-list">
                    {proc.steps.map((step, j) => <li key={j}>{step}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="tabs-header">
                <button className="tab-btn active">{processInfo.mode === 'ऑनलाइन' ? 'ऑनलाइन' : 'ऑफ़लाइन'}</button>
              </div>
              <ol className="flat-list">
                {s.steps.map((step,idx)=>(
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </>
          )}
          
          {processInfo.formUrl&&(
            <div style={{marginTop:20}}>
              <a href={processInfo.formUrl} target="_blank" rel="noopener noreferrer" className="btn secondary form-download-btn">
                आवेदन पत्र डाउनलोड करें (PDF) ↗
              </a>
            </div>
          )}
          {s.applicationUrl&&!processInfo.formUrl?.endsWith('.pdf')&&(
            <div style={{marginTop:20}}>
              <a className="btn" href={'/out/'+s.slug+'?kind=application'} target="_blank" rel="noopener noreferrer">
                आधिकारिक पोर्टल पर आवेदन करें ↗
              </a>
            </div>
          )}
        </section>

        {/* 6. आवश्यक दस्तावेज़ */}
        <section className="flat-section" id="dastavej">
          <h2 className="flat-section-heading">आवश्यक दस्तावेज़</h2>
          <ul className="flat-list">
            {s.documents.map((doc,idx)=>(
              <li key={idx}>{doc}</li>
            ))}
          </ul>
        </section>

        {/* 7. अधिकतर पूछे जाने वाले सवाल */}
        <section className="flat-section" id="faqs">
          <h2 className="flat-section-heading">अधिकतर पूछे जाने वाले सवाल</h2>
          <div className="faq-accordion-list">
            {(s.faqs && s.faqs.length > 0 ? s.faqs.map(f => ({q: f.question, a: f.answer})) : faqs).map((f,idx)=>(
              <details key={idx} className="yojna-faq-details" open={idx===0} style={{border:'1px solid #e2e8f0', borderRadius:6, marginBottom:10, padding:15, background:'#f7fafc'}}>
                <summary className="yojna-faq-summary" style={{fontWeight:600, cursor:'pointer', color:'#2d3748', display:'flex', justifyContent:'space-between'}}>
                  {f.q} <span>▾</span>
                </summary>
                <div style={{marginTop:10, color:'#4a5568'}}>
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 8. स्रोत और संदर्भ */}
        <section className="flat-section" id="sandarbh">
          <h2 className="flat-section-heading">स्रोत और संदर्भ</h2>
          <ul className="flat-list" style={{listStyle:'none', paddingLeft:0}}>
            <li><b>नोडल विभाग:</b> {s.department}</li>
            <li><b>आधिकारिक स्रोत:</b> {s.sourceUrl ? <a href={'/out/'+s.slug+'?kind=source'} target="_blank" rel="noopener noreferrer" style={{color:'#3182ce', textDecoration:'underline'}}>{new URL(s.sourceUrl).hostname}</a> : 'उपलब्ध नहीं'}</li>
          </ul>
        </section>
      </div>

      {/* 3. Right Sidebar Actions */}
      <aside className="detail-aside">
        <SchemeActions s={s} initialCount={c?.n??0}/>
      </aside>
    </div>

    {/* Structured data for Google rich results */}
    {breadcrumbSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>}
    {govServiceSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(govServiceSchema).replace(/</g,'\\u003c')}}/>}
    {howToSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howToSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
