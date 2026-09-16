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

  return <main id="main" className="page-wrap">
    <Link className="small inline-link" href="/">← योजनाएं खोजें</Link>

    {/* Header: Title, English Subtitle, Tags, and 'पात्रता की जाँच करें' CTA */}
    <div className="yojna-header">
      <h1 className="yojna-title">{s.title}</h1>
      <p className="yojna-english-sub">
        {s.english} · {s.state==='madhya-pradesh'?'मध्य प्रदेश शासन':'केंद्र सरकार'}
      </p>

      {/* Tags: वित्तीय सहायता, समाज कल्याण, सशक्तिकरण */}
      <div className="yojna-tags-row">
        {tags.map((tag,idx)=>(
          <span key={idx} className="yojna-tag-pill">{tag}</span>
        ))}
      </div>

      {/* पात्रता की जाँच करें Button */}
      <div className="yojna-check-wrap">
        <Link href={'/mere-liye?slug='+s.slug} className="yojna-check-btn">
          <span>पात्रता की जाँच करें</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span className="yojna-check-hint">1 मिनट में जानें कि क्या आप इस योजना के लिए पात्र हैं</span>
      </div>
    </div>

    <div style={{marginBottom:20}}><Status s={s}/></div>
    {s.isSample&&<SampleNotice/>}
    {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&(
      <div className="sample-note">इस योजना की स्थिति बदल चुकी है या दोबारा समीक्षा जरूरी है। आवेदन से पहले सरकारी स्रोत पर पुष्टि करें।</div>
    )}

    <div className="detail-grid">
      <div className="detail-body">
        <OfficialImage slug={s.slug} scheme={s}/>

        {/* 1. विवरण */}
        <section className="panel yojna-seq-section" id="vivaran">
          <h2 className="yojna-section-heading">विवरण</h2>
          <p className="yojna-desc-text">{s.summary}</p>
        </section>

        {/* 2. लाभ */}
        <section className="panel yojna-seq-section" id="labh">
          <h2 className="yojna-section-heading">लाभ</h2>
          <div className="yojna-benefit-card">
            <span className="benefit-badge-pill">वित्तीय सहायता / मुख्य लाभ</span>
            <p className="benefit-main-amount">{s.benefit}</p>
            <p className="benefit-subtext">लाभ सीधे लाभार्थी के आधार-लिंक DBT बैंक खाते में अंतरित किया जाता है।</p>
          </div>
        </section>

        {/* 3. पात्रता */}
        <section className="panel yojna-seq-section" id="patrata">
          <h2 className="yojna-section-heading">पात्रता</h2>
          <p className="yojna-lead-note">इस योजना का लाभ लेने के लिए मुख्य पात्रता शर्तें:</p>
          <ul className="yojna-eligibility-list">
            {eligibilityList.map((item,idx)=>{
              const hasYa=item.includes('(या)');
              const cleanText=item.replace('(या)','').trim();
              return (
                <li key={idx} className="yojna-eligibility-item">
                  <div className="eligibility-content">
                    <span className="eligibility-bullet" aria-hidden="true">✓</span>
                    <span className="eligibility-text">{cleanText}</span>
                  </div>
                  {hasYa&&<span className="or-badge">(या)</span>}
                </li>
              );
            })}
          </ul>
          <div className="patrata-footer">
            <p className="small-note">ये नियम सामान्य पात्रता दर्शाते हैं। अपवादों सहित अंतिम पात्रता संबंधित विभाग तय करता है।</p>
            <Link className="btn secondary" href={'/mere-liye?slug='+s.slug}>मेरी स्थिति से मिलान करें →</Link>
          </div>
        </section>

        {/* 4. आवेदन प्रक्रिया */}
        <section className="panel yojna-seq-section" id="aavedan">
          <h2 className="yojna-section-heading">आवेदन प्रक्रिया</h2>
          <div className="process-header-bar">
            <span className="mode-pill">मोड: <b>{processInfo.mode}</b></span>
          </div>
          <ol className="yojna-steps-list">
            {s.steps.map((step,idx)=>(
              <li key={idx} className="yojna-step-item">
                <span className="step-num">{idx+1}</span>
                <div className="step-content">
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
          {processInfo.formUrl&&(
            <div className="form-download-strip">
              <div className="form-strip-left">
                <span className="file-icon" aria-hidden="true">📄</span>
                <div>
                  <strong>{processInfo.formName||'आधिकारिक आवेदन पत्र (PDF)'}</strong>
                  <small className="block-sub">संबंधित कार्यालय में जमा करने हेतु प्रपत्र</small>
                </div>
              </div>
              <a
                href={processInfo.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn secondary form-download-btn"
              >
                आवेदन पत्र डाउनलोड करें (PDF) ↗
              </a>
            </div>
          )}
          {s.applicationUrl&&!processInfo.formUrl?.endsWith('.pdf')&&(
            <div className="online-apply-strip">
              <a className="btn" href={'/out/'+s.slug+'?kind=application'} target="_blank" rel="noopener noreferrer">
                आधिकारिक पोर्टल पर आवेदन करें ↗
              </a>
            </div>
          )}
        </section>

        {/* 5. आवश्यक दस्तावेज़ */}
        <section className="panel yojna-seq-section" id="dastavej">
          <h2 className="yojna-section-heading">आवश्यक दस्तावेज़</h2>
          <p className="yojna-lead-note">आवेदन करने से पहले निम्नलिखित सभी आवश्यक दस्तावेज़ तैयार रखें:</p>
          <ul className="yojna-docs-grid">
            {s.documents.map((doc,idx)=>(
              <li key={idx} className="yojna-doc-chip">
                <span className="doc-check-icon" aria-hidden="true">✔</span>
                <span className="doc-name">{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. अधिकतर पूछे जाने वाले सवाल */}
        <section className="panel yojna-seq-section" id="faqs">
          <h2 className="yojna-section-heading">अधिकतर पूछे जाने वाले सवाल</h2>
          <div className="faq-accordion-list">
            {faqs.map((f,idx)=>(
              <details key={idx} className="yojna-faq-details" open={idx===0}>
                <summary className="yojna-faq-summary">
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-arrow-icon" aria-hidden="true">▾</span>
                </summary>
                <div className="yojna-faq-body">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 7. स्रोत और संदर्भ */}
        <section className="panel yojna-seq-section" id="sandarbh">
          <h2 className="yojna-section-heading">स्रोत और संदर्भ</h2>
          <div className="source-info-box">
            <div className="source-row">
              <span className="source-label">नोडल विभाग:</span>
              <span className="source-value"><b>{s.department}</b></span>
            </div>
            <div className="source-row">
              <span className="source-label">आधिकारिक स्रोत:</span>
              <span className="source-value">
                {s.sourceUrl?(
                  <a className="inline-link" href={'/out/'+s.slug+'?kind=source'} target="_blank" rel="noopener noreferrer">
                    {new URL(s.sourceUrl).hostname} ↗
                  </a>
                ):(
                  'सरकारी स्रोत का लिंक अभी नहीं मिला है।'
                )}
              </span>
            </div>
            <div className="source-row">
              <span className="source-label">सत्यापन स्थिति:</span>
              <span className="source-value">
                {s.verifiedAt?`आधिकारिक स्रोत से सत्यापित (${new Date(s.verifiedAt).toLocaleDateString('hi-IN')})`:'सत्यापन प्रक्रियाधीन'}
              </span>
            </div>
            <div className="source-row">
              <span className="source-label">अगली समीक्षा:</span>
              <span className="source-value">
                {s.nextReviewAt?new Date(s.nextReviewAt).toLocaleDateString('hi-IN'):'प्रथम सत्यापन बाकी'}
              </span>
            </div>
            {s.sourceNotes&&(
              <div className="source-notes-callout">
                <p><b>समीक्षा टिप्पणी:</b> {s.sourceNotes}</p>
              </div>
            )}
            <div className="transparency-disclaimer">
              <small>यह एक स्वतंत्र नागरिक सूचना पोर्टल है। सरकारी नियमों, तिथियों और पात्रता में बदलाव संभव है। कृपया अंतिम आवेदन से पूर्व आधिकारिक सरकारी स्रोत से पुष्टि अवश्य करें।</small>
            </div>
          </div>
        </section>
      </div>

      <aside className="detail-aside">
        <SchemeActions s={s} initialCount={c?.n??0}/>
      </aside>
    </div>

    {/* Structured data for Google rich results */}
    {govServiceSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(govServiceSchema).replace(/</g,'\\u003c')}}/>}
    {howToSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howToSchema).replace(/</g,'\\u003c')}}/>}
    {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>}
  </main>;
}
