'use client';
import {translations, useLanguage} from '@/lib/i18n';
import type {Scheme} from '@/lib/domain';
import {BackButton} from '@/components/back-button';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {Status,SampleNotice,Card} from '@/components/site';
import {SchemeActions} from '@/components/scheme-actions';
import {SchemeFeedback} from '@/components/scheme-feedback';
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
  const {lang} = useLanguage();
  const hasEnglishArticle = Boolean(
    s.detailedDescriptionEn?.length && s.benefitsListEn?.length &&
    s.eligibilityDescriptionEn?.length && s.exclusionsEn?.length &&
    s.applicationProcessEn?.length && s.documentsEn?.length && s.faqsEn?.length
  );
  const pageLang = lang === 'en' && hasEnglishArticle ? 'en' : 'hi';
  const t = translations[pageLang];
  const isReviewed = s.editorial?.publicationStatus === 'REVIEWED';
  const verifiedDate = s.editorial?.reviewedAt;
  const hasDatedSources = Boolean(s.references?.some((reference) => reference.accessedAt));
  const displayDocuments = pageLang === 'en' ? (s.documentsEn ?? []) : s.documents;
  const displayFaqs = pageLang === 'en'
    ? (s.faqsEn ?? []).map((faq) => ({q: faq.question, a: faq.answer}))
    : s.faqs?.length
      ? s.faqs.map((faq) => ({q: faq.question, a: faq.answer}))
      : faqs;
  const officialApplicationUrl = isReviewed ? (s.applicationUrl || processInfo.formUrl) : null;
  const applicationIsPdf = officialApplicationUrl?.toLowerCase().endsWith('.pdf');
  const hasDocuments = hasDatedSources && displayDocuments.length > 0;
  const hasProcess = Boolean(
    (pageLang === 'en' && s.applicationProcessEn && s.applicationProcessEn.length > 0) ||
    (hasDatedSources && s.applicationProcess && s.applicationProcess.length > 0) ||
    (isReviewed && s.steps.length > 0) ||
    officialApplicationUrl
  );

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
        <BackButton fallbackUrl={s.state === 'madhya-pradesh' ? '/state/madhya-pradesh' : '/'} />
        <nav aria-label="breadcrumb" className="breadcrumb-nav" style={{fontSize:'0.9rem', color:'#718096'}}>
          <Link href="/" className="inline-link">{t.breadcrumbHome}</Link> &gt; <Link href={s.state === 'madhya-pradesh' ? '/state/madhya-pradesh' : '/'} className="inline-link">{s.state === 'madhya-pradesh' ? t.mpGov + ' ' + (pageLang === 'hi' ? 'की योजनाएं' : 'Schemes') : (pageLang === 'en' ? 'Central government schemes' : 'केंद्र सरकार की योजनाएं')}</Link> &gt; <span style={{color:'#2d3748', fontWeight:500}}>{pageLang === 'en' ? s.english : s.title}</span>
        </nav>
      </div>

      <div className="yojna-header">
        <h1 lang={pageLang} className="yojna-title" style={{fontSize:'2.2rem', color:'#111', fontWeight:'700'}}>{pageLang === 'en' ? s.english : s.title}</h1>
        
        <div className="yojna-tags-row" style={{marginTop:'15px', marginBottom:'15px'}}>
          {s.lastUpdated && <span className="yojna-tag-pill-outline" style={{borderColor: '#ecc94b', color: '#b7791f'}}>{t.lastUpdate} {new Date(s.lastUpdated).toLocaleDateString(pageLang === 'en' ? 'en-IN' : 'hi-IN')}</span>}
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

      <div style={{marginBottom:20}}>{s.editorial?.verificationStatus === 'NEEDS_VERIFICATION' ? <span className="yojna-tag-pill-outline">विस्तृत जानकारी का सत्यापन आवश्यक</span> : <Status s={s}/>}</div>
      {s.isSample&&<SampleNotice/>}
      {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&(
        <div className="sample-note">{t.staleNotice}</div>
      )}
      {lang === 'en' && !hasEnglishArticle && <p className="source-review-note" lang="en">A complete verified English version is not available yet. The reviewed Hindi content is shown below.</p>}



      <div className="detail-grid">
        {/* 1. Left Navigation */}
        <aside className="detail-left-sidebar">
          <nav className="detail-left-nav">
            <a href="#vivaran" className="nav-link active">{t.detailDescription}</a>
            <a href="#labh" className="nav-link">{t.detailBenefits}</a>
            <a href="#patrata" className="nav-link">{t.detailEligibility}</a>
            <a href="#apvad" className="nav-link">{t.detailExclusions}</a>
            {hasDocuments && <a href="#dastavej" className="nav-link">{t.detailDocuments}</a>}
            {hasProcess && <a href="#aavedan" className="nav-link">{t.detailProcess}</a>}
            {s.trackingGuidance && <a href="#stithi" className="nav-link">{pageLang === 'en' ? 'Status / e-KYC' : 'स्थिति / e-KYC'}</a>}
            <a href="#faqs" className="nav-link">{t.detailFaqs}</a>
            <a href="#sandarbh" className="nav-link">{t.detailSources}</a>
            <a href="#feedback" className="nav-link">{t.detailFeedback}</a>
          </nav>
        </aside>

        {/* 2. Main Content Body */}
        <div className="detail-body" lang={pageLang}>
          <OfficialImage slug={s.slug} scheme={s} priority={true} />


          {/* 1. विवरण */}
          <section className="flat-section" id="vivaran">
            <h2 className="flat-section-heading">{t.detailDescription}</h2>
            <p><strong>{pageLang === 'en' ? 'Scope: ' : 'योजना का क्षेत्र: '}</strong>{s.state === 'madhya-pradesh' ? 'मध्य प्रदेश' : 'केंद्रीय योजना — लागू क्षेत्र और स्थानीय प्रक्रिया योजना के नियमों के अनुसार'}</p>
            {pageLang === 'en' && s.detailedDescriptionEn ? (
              s.detailedDescriptionEn.map((p, idx) => <p key={idx} style={{marginBottom:'1em'}}>{p}</p>)
            ) : s.detailedDescription ? (
              s.detailedDescription.map((p, idx) => <p key={idx} style={{marginBottom:'1em'}}>{p}</p>)
            ) : (
              <p>{pageLang === 'en' ? (s.summaryEn ?? s.summary) : s.summary}</p>
            )}
            {s.practicalGuidance?.length ? <div style={{marginTop:24}}><h3>इस जानकारी को अपने काम में कैसे लें</h3>{s.practicalGuidance.map((p,i) => <p key={i}>{p}</p>)}</div> : null}
          </section>

          {/* 2. लाभ */}
          <section className="flat-section" id="labh">
            <h2 className="flat-section-heading">{t.detailBenefits}</h2>
            {(pageLang === 'en' && s.benefitsListEn && s.benefitsListEn.length > 0) ? (
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
                <li>{pageLang === 'en' ? (s.benefitEn ?? s.benefit) : s.benefit}</li>
              </ul>
            )}
          </section>

          {/* 3. पात्रता */}
          <section className="flat-section" id="patrata">
            <h2 className="flat-section-heading">{t.detailEligibility}</h2>
            <p>{pageLang === 'en' ? 'Read these conditions together. The department makes the final eligibility decision.' : 'इन शर्तों को साथ पढ़ें। केवल एक शर्त पूरी होने से आवेदन मंजूर होना तय नहीं है। अंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।'}</p>
            {pageLang === 'en' && s.eligibilityDescriptionEn ? (
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
              eligibilityList.length ? <ol className="flat-list">
                {eligibilityList.map((item,idx)=>{
                  const cleanText=item.replace('(या)','').replace('(or)','').trim();
                  return <li key={idx}>{cleanText} {(item.includes('(या)') || item.includes('(or)'))&&<span style={{color:'#718096'}}>{pageLang === 'en' ? '(or)' : '(या)'}</span>}</li>;
                })}
              </ol> : <p className="verification-needed">सत्यापन आवश्यक: आधिकारिक स्रोत से पूरी पात्रता सूची की समीक्षा अभी बाकी है।</p>
            )}
          </section>

          {/* 4. अपवाद */}
          <section className="flat-section" id="apvad">
            <h2 className="flat-section-heading">{t.detailExclusions}</h2>
            <h3>{pageLang === 'en' ? 'Who is excluded, and what needs checking?' : 'कौन पात्र नहीं है और किन बातों की जाँच चाहिए?'}</h3>
            {pageLang === 'en' && s.exclusionsEn && s.exclusionsEn.length > 0 ? (
              <ul className="flat-list">
                {s.exclusionsEn.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : s.exclusions && s.exclusions.length > 0 ? (
              <ul className="flat-list">
                {s.exclusions.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : (
              <p className="verification-needed">सत्यापन आवश्यक: आधिकारिक दिशानिर्देश में दी गई अपात्रता और अपवाद की शर्तें अभी दर्ज नहीं हैं।</p>
            )}
          </section>

          {/* 5. आवेदन प्रक्रिया */}
          {hasProcess && <section className="flat-section" id="aavedan">
            <h2 className="flat-section-heading">{t.detailProcess}</h2>
            
            {pageLang === 'en' && s.applicationProcessEn && s.applicationProcessEn.length > 0 ? (
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
            ) : hasDatedSources && s.applicationProcess && s.applicationProcess.length > 0 ? (
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
            ) : isReviewed && s.steps.length ? (
              <>
                <div className="tabs-header">
                  <p className="tab-btn active">{processInfo.mode}</p>
                </div>
                <ol className="flat-list">
                  {(pageLang === 'en' && s.stepsEn ? s.stepsEn : s.steps).map((step,idx)=>(
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </>
            ) : null}
            
            {officialApplicationUrl&&(
              <div style={{marginTop:20}}>
                <a href={officialApplicationUrl} target="_blank" rel="noopener noreferrer" className="btn secondary form-download-btn" onClick={() => { import('@/components/site').then(m => m.track('official_link_clicked')); }}>
                  {applicationIsPdf ? t.downloadForm : t.applyOnPortal} ↗
                </a>
              </div>
            )}
          </section>}

          {s.trackingGuidance && <section className="flat-section" id="stithi">
            <h2 className="flat-section-heading">{/e-?kyc/i.test(s.trackingGuidance) ? (pageLang === 'en' ? 'Application status and e-KYC' : 'आवेदन की स्थिति और e-KYC') : (pageLang === 'en' ? 'Application status' : 'आवेदन की स्थिति कैसे देखें?')}</h2>
            <p>{s.trackingGuidance}</p>
          </section>}

          {/* 6. आवश्यक दस्तावेज़ */}
          {hasDocuments && <section className="flat-section" id="dastavej">
            <h2 className="flat-section-heading">{t.detailDocuments}</h2>
            <p>{pageLang === 'en' ? 'Check which documents apply to your application in the current official form. Conditional documents are not required from everyone.' : 'वर्तमान सरकारी प्रपत्र से मिलाएँ कि आपके मामले में कौन-सा दस्तावेज़ लागू है। किसी खास श्रेणी के लिए माँगा गया प्रमाण हर आवेदक के लिए जरूरी नहीं होता।'}</p>
            {hasDocuments && <ul className="flat-list">
              {displayDocuments.map((doc,idx)=>(
                <li key={idx}>{doc}</li>
              ))}
            </ul>}
          </section>}

          {/* 7. अधिकतर पूछे जाने वाले सवाल */}
          <section className="flat-section" id="faqs">
            <h2 className="flat-section-heading">{t.detailFaqs}</h2>
            <div className="faq-accordion-list">
              {displayFaqs.map((f,idx)=>(
                <details key={idx} className="yojna-faq-details" open={idx===0} style={{border:'1px solid #e2e8f0', borderRadius:6, marginBottom:10, padding:15, background:'#f7fafc'}}>
                  <summary className="yojna-faq-summary" style={{fontWeight:600, cursor:'pointer', color:'#2d3748', display:'flex', justifyContent:'space-between'}}>
                    {f.q} <span>▾</span>
                  </summary>
                  <div style={{marginTop:10, color:'#4a5568'}}>
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
              {!displayFaqs.length && <p className="verification-needed">इस योजना के लिए स्रोत-समर्थित सवाल-जवाब की समीक्षा अभी बाकी है।</p>}
            </div>
          </section>

          <WhatsAppShareBanner title={pageLang === 'en' ? s.english : s.title} slug={s.slug}/>

          {/* 8. स्रोत और संदर्भ */}
          <section className="flat-section" id="sandarbh">
            <h2 className="flat-section-heading">{t.detailSources}</h2>
            <ul className="flat-list" style={{listStyle:'none', paddingLeft:0}}>
              <li><b>{t.nodalDept}</b> {s.department}</li>
              <li><b>{t.officialSource}</b> {s.sourceUrl ? <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{color:'#3182ce', textDecoration:'underline'}} onClick={() => { import('@/components/site').then(m => m.track('official_link_clicked')); }}>{new URL(s.sourceUrl).hostname}</a> : t.notAvailable}</li>
            </ul>
            <p><strong>इस लेख का अंतिम स्वतंत्र सत्यापन: </strong>{s.editorial?.reviewedAt ? new Date(s.editorial.reviewedAt).toLocaleDateString('hi-IN') : 'सत्यापन आवश्यक'}</p>
            <p>{s.sourceNotes}</p>
            <ol className="flat-list">
              {s.references?.map((ref,i) => <li key={ref.url + i} style={{marginBottom:18}}>
                <a className="inline-link" href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title} ↗</a>
                <p>{ref.organization} · संबंधित भाग: {ref.sections.join(', ')}</p>
                <p><small>{ref.accessedAt ? `स्रोत देखा: ${new Date(ref.accessedAt).toLocaleDateString('hi-IN')}` : 'इस संपादन में स्रोत की नई स्वतंत्र जाँच बाकी है।'}</small></p>
                {ref.note && <p>{ref.note}</p>}
              </li>)}
            </ol>
            <p>सरकारी योजना सेतु एक स्वतंत्र सूचना वेबसाइट है। अंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।</p>
          </section>

          <SchemeFeedback slug={s.slug} title={pageLang === 'en' ? s.english : s.title} english={pageLang === 'en'}/>

          {relatedSchemes.length > 0 && (
            <section className="flat-section" id="related" style={{marginTop: 40}}>
              <h2 className="flat-section-heading">{t.detailRelated}</h2>
              <ul className="flat-list" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {relatedSchemes.map(rs => (
                  <li key={rs.slug} style={{ marginBottom: '10px' }}>
                    <Link href={'/yojna/' + rs.slug} style={{ color: '#3182ce', textDecoration: 'underline', fontWeight: 500 }}>
                      {pageLang === 'en' ? rs.english : rs.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
        </div>

        {/* 3. Right Sidebar Actions */}
        <aside className="detail-aside">
          <SchemeActions s={s} initialCount={initialCount}/>
        </aside>
      </div>

      <WhatsAppFloatingCTA title={pageLang === 'en' ? s.english : s.title} slug={s.slug}/>
    </>
  );
}

