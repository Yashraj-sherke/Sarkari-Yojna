'use client';
import {useLanguage} from '@/lib/i18n';
import type {Scheme} from '@/lib/domain';
import {BackButton} from '@/components/back-button';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {Status,SampleNotice,Card} from '@/components/site';
import {SchemeActions} from '@/components/scheme-actions';
import {WhatsAppFloatingCTA, WhatsAppShareBanner} from '@/components/whatsapp-share';

export function YojnaDetailClient({
  s,
  tags,
  eligibilityList,
  processInfo,
  faqs,
  relatedSchemes,
  initialCount
}: {
  s: Scheme;
  tags: string[];
  eligibilityList: string[];
  processInfo: { mode: string; formUrl?: string | null; formName?: string | null };
  faqs: { q: string; a: string }[];
  relatedSchemes: Scheme[];
  initialCount: number;
}) {
  const {t, lang} = useLanguage();

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
        <BackButton fallbackUrl={s.state === 'madhya-pradesh' ? '/state/madhya-pradesh' : '/'} />
        <nav aria-label="breadcrumb" className="breadcrumb-nav" style={{fontSize:'0.9rem', color:'#718096'}}>
          <Link href="/" className="inline-link">{t.breadcrumbHome}</Link> &gt; <Link href={s.state === 'madhya-pradesh' ? '/state/madhya-pradesh' : '/'} className="inline-link">{s.state === 'madhya-pradesh' ? t.mpGov + ' ' + (lang === 'hi' ? 'की योजनाएं' : 'Schemes') : t.breadcrumbHome}</Link> &gt; <span style={{color:'#2d3748', fontWeight:500}}>{lang === 'en' ? s.english : s.title}</span>
        </nav>
      </div>

      <div className="yojna-header">
        <h1 className="yojna-title" style={{fontSize:'2.2rem', color:'#111', fontWeight:'700'}}>{lang === 'en' ? s.english : s.title}</h1>
        
        <div className="yojna-tags-row" style={{marginTop:'15px', marginBottom:'15px'}}>
          {s.lastUpdated && <span className="yojna-tag-pill-outline" style={{borderColor: '#ecc94b', color: '#b7791f'}}>{t.lastUpdate} {new Date(s.lastUpdated).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN')}</span>}
          {tags.map((tag,idx)=>(
            <span key={idx} className="yojna-tag-pill-outline">{tag}</span>
          ))}
        </div>

        <div className="yojna-check-wrap">
          <Link href={'/mere-liye?slug='+s.slug} className="yojna-check-btn-outline">
            {t.checkEligibility}
          </Link>
        </div>
      </div>

      <div style={{marginBottom:20}}><Status s={s}/></div>
      {s.isSample&&<SampleNotice/>}
      {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&(
        <div className="sample-note">{t.staleNotice}</div>
      )}

      <div className="detail-grid">
        {/* 1. Left Navigation */}
        <aside className="detail-left-sidebar">
          <nav className="detail-left-nav">
            <a href="#vivaran" className="nav-link active">{t.detailDescription}</a>
            <a href="#labh" className="nav-link">{t.detailBenefits}</a>
            <a href="#patrata" className="nav-link">{t.detailEligibility}</a>
            <a href="#apvad" className="nav-link">{t.detailExclusions}</a>
            <a href="#aavedan" className="nav-link">{t.detailProcess}</a>
            <a href="#dastavej" className="nav-link">{t.detailDocuments}</a>
            <a href="#faqs" className="nav-link">{t.detailFaqs}</a>
            <a href="#sandarbh" className="nav-link">{t.detailSources}</a>
            <a href="#feedback" className="nav-link">{t.detailFeedback}</a>
          </nav>
        </aside>

        {/* 2. Main Content Body */}
        <div className="detail-body">
          <OfficialImage slug={s.slug} scheme={s}/>

          {/* 1. विवरण */}
          <section className="flat-section" id="vivaran">
            <h2 className="flat-section-heading">{t.detailDescription}</h2>
            {lang === 'en' && s.detailedDescriptionEn ? (
              s.detailedDescriptionEn.map((p, idx) => <p key={idx} style={{marginBottom:'1em'}}>{p}</p>)
            ) : s.detailedDescription ? (
              s.detailedDescription.map((p, idx) => <p key={idx} style={{marginBottom:'1em'}}>{p}</p>)
            ) : (
              <p>{lang === 'en' ? (s.summaryEn ?? s.summary) : s.summary}</p>
            )}
          </section>

          {/* 2. लाभ */}
          <section className="flat-section" id="labh">
            <h2 className="flat-section-heading">{t.detailBenefits}</h2>
            {(lang === 'en' && s.benefitsListEn && s.benefitsListEn.length > 0) ? (
              s.benefitsListEn.map((b, i) => (
                <div key={i} style={{marginBottom:15}}>
                  <h3 style={{fontSize:'1.1rem', fontWeight:600, marginBottom:8, color:'#2d3748'}}>{b.heading}</h3>
                  <ul className="flat-list">
                    {b.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </div>
              ))
            ) : (s.benefitsList && s.benefitsList.length > 0) ? (
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
                <li>{lang === 'en' ? (s.benefitEn ?? s.benefit) : s.benefit}</li>
                <li>{t.defaultBenefit}</li>
              </ul>
            )}
          </section>

          {/* 3. पात्रता */}
          <section className="flat-section" id="patrata">
            <h2 className="flat-section-heading">{t.detailEligibility}</h2>
            {lang === 'en' && s.eligibilityDescriptionEn ? (
              <ul className="flat-list">
                {s.eligibilityDescriptionEn.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : s.eligibilityDescription ? (
              <ul className="flat-list">
                {s.eligibilityDescription.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <ol className="flat-list">
                {eligibilityList.map((item,idx)=>{
                  const cleanText=item.replace('(या)','').replace('(or)','').trim();
                  return <li key={idx}>{cleanText} {(item.includes('(या)') || item.includes('(or)'))&&<span style={{color:'#718096'}}>{lang === 'en' ? '(or)' : '(या)'}</span>}</li>;
                })}
              </ol>
            )}
          </section>

          {/* 4. अपवाद */}
          <section className="flat-section" id="apvad">
            <h2 className="flat-section-heading">{t.detailExclusions}</h2>
            {lang === 'en' && s.exclusionsEn && s.exclusionsEn.length > 0 ? (
              <ul className="flat-list">
                {s.exclusionsEn.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : s.exclusions && s.exclusions.length > 0 ? (
              <ul className="flat-list">
                {s.exclusions.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : (
              <ol className="flat-list">
                <li>{t.noExclusions}</li>
              </ol>
            )}
          </section>

          {/* 5. आवेदन प्रक्रिया */}
          <section className="flat-section" id="aavedan">
            <h2 className="flat-section-heading">{t.detailProcess}</h2>
            
            {lang === 'en' && s.applicationProcessEn && s.applicationProcessEn.length > 0 ? (
              <div>
                {s.applicationProcessEn.map((proc, i) => (
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
            ) : s.applicationProcess && s.applicationProcess.length > 0 ? (
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
                  <button className="tab-btn active">{processInfo.mode === 'ऑनलाइन' ? t.online : t.offline}</button>
                </div>
                <ol className="flat-list">
                  {(lang === 'en' && s.stepsEn ? s.stepsEn : s.steps).map((step,idx)=>(
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </>
            )}
            
            {processInfo.formUrl&&(
              <div style={{marginTop:20}}>
                <a href={processInfo.formUrl} target="_blank" rel="noopener noreferrer" className="btn secondary form-download-btn">
                  {t.downloadForm} ↗
                </a>
              </div>
            )}
            {s.applicationUrl&&!processInfo.formUrl?.endsWith('.pdf')&&(
              <div style={{marginTop:20}}>
                <a className="btn" href={'/out/'+s.slug+'?kind=application'} target="_blank" rel="noopener noreferrer">
                  {t.applyOnPortal} ↗
                </a>
              </div>
            )}
          </section>

          {/* 6. आवश्यक दस्तावेज़ */}
          <section className="flat-section" id="dastavej">
            <h2 className="flat-section-heading">{t.detailDocuments}</h2>
            <ul className="flat-list">
              {(lang === 'en' && s.documentsEn ? s.documentsEn : s.documents).map((doc,idx)=>(
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </section>

          {/* 7. अधिकतर पूछे जाने वाले सवाल */}
          <section className="flat-section" id="faqs">
            <h2 className="flat-section-heading">{t.detailFaqs}</h2>
            <div className="faq-accordion-list">
              {(lang === 'en' && s.faqsEn && s.faqsEn.length > 0 ? s.faqsEn.map(f => ({q: f.question, a: f.answer})) : s.faqs && s.faqs.length > 0 ? s.faqs.map(f => ({q: f.question, a: f.answer})) : faqs).map((f,idx)=>(
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

          <WhatsAppShareBanner title={lang === 'en' ? s.english : s.title} slug={s.slug}/>

          {/* 8. स्रोत और संदर्भ */}
          <section className="flat-section" id="sandarbh">
            <h2 className="flat-section-heading">{t.detailSources}</h2>
            <ul className="flat-list" style={{listStyle:'none', paddingLeft:0}}>
              <li><b>{t.nodalDept}</b> {s.department}</li>
              <li><b>{t.officialSource}</b> {s.sourceUrl ? <a href={'/out/'+s.slug+'?kind=source'} target="_blank" rel="noopener noreferrer" style={{color:'#3182ce', textDecoration:'underline'}}>{new URL(s.sourceUrl).hostname}</a> : t.notAvailable}</li>
            </ul>
          </section>

          {relatedSchemes.length > 0 && (
            <section className="flat-section" id="related" style={{marginTop: 40}}>
              <h2 className="flat-section-heading">{t.detailRelated}</h2>
              <div className="related-schemes-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                {relatedSchemes.map(rs => <Card key={rs.slug} s={rs} />)}
              </div>
            </section>
          )}
          
        </div>

        {/* 3. Right Sidebar Actions */}
        <aside className="detail-aside">
          <SchemeActions s={s} initialCount={initialCount}/>
        </aside>
      </div>

      <WhatsAppFloatingCTA title={lang === 'en' ? s.english : s.title} slug={s.slug}/>
    </>
  );
}
