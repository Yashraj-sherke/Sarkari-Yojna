'use client';
import React, { useState } from 'react';
import {translations, useLanguage} from '@/lib/i18n';
import {categories, type Scheme} from '@/lib/domain';
import {guides} from '@/lib/guides';
import {isGuideRelevantToScheme} from '@/lib/guide-links';
import {BackButton} from '@/components/back-button';
import {OfficialImage} from '@/components/official-image';
import Link from 'next/link';
import {Status,SampleNotice} from '@/components/site';
import {ShieldCheck} from 'lucide-react';
import {SchemeActions} from '@/components/scheme-actions';
import {SchemeFeedback} from '@/components/scheme-feedback';
import {WhatsAppFloatingCTA, WhatsAppShareBanner} from '@/components/whatsapp-share';
import { SITE_URL, AUTHOR_NAME, AUTHOR_ROLE, AUTHOR_LINKEDIN_URL } from '@/lib/config';
import { SchemeQuickFacts } from '@/components/scheme/quick-facts';
import { SchemeQuickAnswer } from '@/components/scheme/quick-answer';
import { SchemeClusterLinks } from '@/components/scheme/cluster-links';
import { buildSchemeNavigation } from '@/lib/scheme-navigation';
import { gobardhanFaqSources } from '@/lib/scheme-content/gobardhan-faqs';

const parseRichText = (text: string) => {
  // First handle markdown links, then handle bold tags (** or <strong>)
  const linkParts = text.split(/(\[.*?\]\(.*?\))/g);
  return linkParts.map((part, i) => {
    const match = part.match(/\[(.*?)\]\((.*?)\)/);
    if (match) {
      return <Link key={i} href={match[2]} style={{color:'#2b6cb0', textDecoration:'underline'}}>{match[1]}</Link>;
    }
    
    // Process bold text in the non-link parts
    const boldParts = part.split(/(\*\*.*?\*\*|<strong>.*?<\/strong>)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
      }
      if (bp.startsWith('<strong>') && bp.endsWith('</strong>')) {
        return <strong key={`${i}-${j}`}>{bp.slice(8, -9)}</strong>;
      }
      return bp;
    });
  });
};

export function YojnaDetailClient({
  s,
  tags,
  eligibilityList,
  processInfo,
  faqs,
  relatedSchemes,
  relatedUpdates,
  initialCount
}: {
  s: Scheme;
  tags: string[];
  eligibilityList: string[];
  processInfo: { mode: string; formUrl?: string | null; formName?: string | null };
  faqs: { q: string; a: string }[];
  relatedSchemes: Scheme[];
  relatedUpdates: { slug: string; title: string }[];
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isReviewed = s.editorial?.publicationStatus === 'REVIEWED';
  const category = categories.find(c => c.id === s.category);
  const relatedGuides = guides.filter(g => isGuideRelevantToScheme(g.slug, s));
  const hasDatedSources = Boolean(s.references?.some((reference) => reference.accessedAt));
  const displayDocuments = pageLang === 'en' ? (s.documentsEn ?? []) : s.documents;
  const displayFaqs = pageLang === 'en'
    ? (s.faqsEn ?? []).map((faq) => ({q: faq.question, a: faq.answer}))
    : s.faqs?.length
      ? s.faqs.map((faq) => ({q: faq.question, a: faq.answer}))
      : faqs;
  const officialApplicationUrl = s.applicationUrl || processInfo.formUrl || null;
  const applicationIsPdf = officialApplicationUrl?.toLowerCase().endsWith('.pdf');
  const hasDocuments = hasDatedSources && displayDocuments.length > 0;
  const hasExclusions = Boolean(
    (pageLang === 'en' && s.exclusionsEn && s.exclusionsEn.length > 0) ||
    (s.exclusions && s.exclusions.length > 0)
  );
  const hasProcess = Boolean(
    (pageLang === 'en' && s.applicationProcessEn && s.applicationProcessEn.length > 0) ||
    (hasDatedSources && s.applicationProcess && s.applicationProcess.length > 0) ||
    (isReviewed && s.steps.length > 0) ||
    officialApplicationUrl
  );
  const navigation = buildSchemeNavigation(s.slug, (pageLang === 'en' ? s.detailedDescriptionEn : s.detailedDescription) ?? [], [
    {id: 'vivaran', label: t.detailDescription},
    {id: 'labh', label: t.detailBenefits},
    {id: 'patrata', label: t.detailEligibility},
    ...(hasExclusions ? [{id: 'apvad', label: t.detailExclusions}] : []),
    ...(hasDocuments ? [{id: 'dastavej', label: t.detailDocuments}] : []),
    ...(hasProcess ? [{id: 'aavedan', label: t.detailProcess}] : []),
    ...(s.trackingGuidance ? [{id: 'stithi', label: pageLang === 'en' ? 'Status / e-KYC' : 'स्थिति / e-KYC'}] : []),
    {id: 'faqs', label: t.detailFaqs},
    {id: 'sandarbh', label: t.detailSources},
    {id: 'feedback', label: t.detailFeedback},
  ], pageLang);

  return (
    <>
      <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
        <BackButton fallbackUrl={s.state === 'madhya-pradesh' ? '/state/madhya-pradesh' : '/'} />
        <nav aria-label="breadcrumb" className="breadcrumb-nav" style={{fontSize:'0.9rem', color:'#718096'}}>
          <Link href="/" className="inline-link">{t.breadcrumbHome}</Link>
          {s.state === 'madhya-pradesh' && <> &gt; <Link href="/state/madhya-pradesh" className="inline-link">मध्य प्रदेश की योजनाएं</Link></>}
          {category && <> &gt; <Link href={`/category/${category.id}`} className="inline-link">{category.name}</Link></>}
          {' > '}<span aria-current="page" style={{color:'#2d3748', fontWeight:500}}>{pageLang === 'en' ? s.english : s.title}</span>
        </nav>
      </div>

      <div className="yojna-header">
        <h1 lang={pageLang} className="yojna-title" style={{fontSize:'2.2rem', color:'#111', fontWeight:'700'}}>
          {pageLang === 'en' ? s.english : s.title}
        </h1>
        {pageLang === 'hi' && s.english && <p lang="en" className="english">{s.english}</p>}
        
        <SchemeQuickAnswer s={s} pageLang={pageLang} />

        <div className="yojna-tags-row" style={{marginTop:'15px', marginBottom:'15px'}}>
          {s.editorial?.reviewedAt && (
            <div style={{background: '#e6fffa', border: '1px solid #38b2ac', color: '#234e52', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px', width: '100%'}}>
              <ShieldCheck size={16} />
              {pageLang === 'en' ? 'Verified against Official Source on ' : 'आधिकारिक स्रोत से सत्यापित: '}
              {new Date(s.editorial.reviewedAt).toLocaleDateString(pageLang === 'en' ? 'en-IN' : 'hi-IN')}
            </div>
          )}
          {s.lastUpdated && <span className="yojna-tag-pill-updated">{t.lastUpdate} {new Date(s.lastUpdated).toLocaleDateString(pageLang === 'en' ? 'en-IN' : 'hi-IN')}</span>}
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

      <div style={{marginBottom:20}}>{s.editorial?.verificationStatus === 'NEEDS_VERIFICATION' ? <p className="source-review-note">{pageLang === 'en' ? 'A detailed guide is available. Check current benefits, eligibility and deadlines on the department website before applying.' : 'विस्तृत योजना गाइड उपलब्ध है। आवेदन से पहले वर्तमान लाभ, पात्रता और अंतिम तारीख विभाग की वेबसाइट पर जाँचें।'}</p> : <Status s={s}/>}</div>
      {s.isSample&&<SampleNotice/>}
      {['NEEDS_REVIEW','CLOSED','ARCHIVED'].includes(s.status)&&(
        <div className="sample-note">{t.staleNotice}</div>
      )}
      {lang === 'en' && !hasEnglishArticle && <p className="source-review-note" lang="en">A complete verified English version is not available yet. The reviewed Hindi content is shown below.</p>}

      <div className="detail-grid">
        {/* 1. Left Navigation */}
        <aside className="detail-left-sidebar">
          {/* Mobile TOC Toggle */}
          <button 
            className="mobile-toc-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
          >
            ☰ {pageLang === 'en' ? 'View in this scheme' : 'इस योजना में देखें'}
          </button>
          
          <nav className={`detail-left-nav ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            {navigation.customized && <h2 className="scheme-nav-heading">इस योजना में देखें</h2>}
            {navigation.sidebar.map((item, index) => <a key={item.id} href={`#${item.id}`} className={`nav-link${index === 0 ? ' active' : ''}`}>{item.label}</a>)}
          </nav>
        </aside>

        {/* 2. Main Content Body */}
        <div className="detail-body" lang={pageLang}>
          <OfficialImage slug={s.slug} scheme={s} priority={true} sizes="(max-width: 880px) 100vw, (max-width: 1200px) 65vw, 760px" />
          <SchemeQuickFacts s={s} pageLang={pageLang} />
          {navigation.customized && <nav className="scheme-content-toc" aria-labelledby="scheme-toc-heading">
            <h2 id="scheme-toc-heading" className="flat-section-heading">इस लेख में क्या मिलेगा</h2>
            <ol className="flat-list">{navigation.toc.map(item => <li key={item.id}><a className="inline-link" href={`#${item.id}`}>{item.label}</a></li>)}</ol>
          </nav>}
          <SchemeClusterLinks
            navigation={navigation.sidebar}
            relatedSchemes={relatedSchemes}
            relatedGuides={relatedGuides}
            relatedUpdates={relatedUpdates}
            pageLang={pageLang}
          />

          {/* 1. विवरण */}
          <section className="flat-section" id="vivaran">
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailDescription : s.title + ' का ' + t.detailDescription}</h2>
            <p><strong>{pageLang === 'en' ? 'Scope: ' : 'योजना का क्षेत्र: '}</strong>{s.state === 'madhya-pradesh' ? (pageLang === 'en' ? 'Madhya Pradesh' : 'मध्य प्रदेश') : (pageLang === 'en' ? 'Central Scheme — Coverage and local process as per scheme rules' : 'केंद्रीय योजना — लागू क्षेत्र और स्थानीय प्रक्रिया योजना के नियमों के अनुसार')}</p>
            {pageLang === 'en' && s.detailedDescriptionEn ? (
              navigation.description.map((p, idx) => p.trim().startsWith('<') ? <div key={idx} className={navigation.customized ? 'scheme-rich-article' : undefined} dangerouslySetInnerHTML={{__html: p}} style={{marginBottom:'1em'}} /> : <p key={idx} style={{marginBottom:'1em'}}>{parseRichText(p)}</p>)
            ) : s.detailedDescription ? (
              navigation.description.map((p, idx) => p.trim().startsWith('<') ? <div key={idx} className={navigation.customized ? 'scheme-rich-article' : undefined} dangerouslySetInnerHTML={{__html: p}} style={{marginBottom:'1em'}} /> : <p key={idx} style={{marginBottom:'1em'}}>{parseRichText(p)}</p>)
            ) : (
              <p>{parseRichText(pageLang === 'en' ? (s.summaryEn ?? s.summary) : s.summary)}</p>
            )}
            {s.practicalGuidance?.length ? <div style={{marginTop:24}}><h3>इस जानकारी को अपने काम में कैसे लें</h3>{s.practicalGuidance.map((p,i) => <p key={i}>{p}</p>)}</div> : null}

          </section>

          {/* 2. लाभ */}
          <section className="flat-section" id="labh">
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailBenefits : s.title + ' के ' + t.detailBenefits}</h2>
            {(pageLang === 'en' && s.benefitsListEn && s.benefitsListEn.length > 0) ? (
              s.benefitsListEn.map((b, i) => (
                <div key={i} style={{marginBottom:15}}>
                  <h3 style={{fontSize:'1.1rem', fontWeight:600, marginBottom:8, color:'#2d3748'}}>{b.heading}</h3>
                  <ul className="flat-list">
                    {b.points.map((p, j) => <li key={j}>{parseRichText(p)}</li>)}
                  </ul>
                </div>
              ))
            ) : (s.benefitsList && s.benefitsList.length > 0) ? (
              s.benefitsList.map((b, i) => (
                <div key={i} style={{marginBottom:15}}>
                  <h3 style={{fontSize:'1.1rem', fontWeight:600, marginBottom:8, color:'#2d3748'}}>{b.heading}</h3>
                  <ul className="flat-list">
                    {b.points.map((p, j) => <li key={j}>{parseRichText(p)}</li>)}
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
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailEligibility : s.title + ' की ' + t.detailEligibility}</h2>
            <p>{pageLang === 'en' ? 'Read these conditions together. The department makes the final eligibility decision.' : 'इन शर्तों को साथ पढ़ें। केवल एक शर्त पूरी होने से आवेदन मंजूर होना तय नहीं है। अंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।'}</p>
            {pageLang === 'en' && s.eligibilityDescriptionEn ? (
              <ul className="flat-list">
                {s.eligibilityDescriptionEn.map((item, idx) => (
                  <li key={idx}>{parseRichText(item)}</li>
                ))}
              </ul>
            ) : s.eligibilityDescription ? (
              <ul className="flat-list">
                {s.eligibilityDescription.map((item, idx) => (
                  <li key={idx}>{parseRichText(item)}</li>
                ))}
              </ul>
            ) : (
              eligibilityList.length ? <ol className="flat-list">
                {eligibilityList.map((item,idx)=>{
                  const cleanText=item.replace('(या)','').replace('(or)','').trim();
                  return <li key={idx}>{cleanText} {(item.includes('(या)') || item.includes('(or)'))&&<span style={{color:'#718096'}}>{pageLang === 'en' ? '(or)' : '(या)'}</span>}</li>;
                })}
              </ol> : <p className="verification-needed">{pageLang === 'en' ? 'The department has not provided a complete eligibility list in the source currently available to us. Check the official portal before applying.' : 'हमें उपलब्ध विभागीय स्रोत में पूरी पात्रता सूची नहीं मिली है। आवेदन से पहले आधिकारिक पोर्टल पर वर्तमान शर्तें देखें।'}</p>
            )}
          </section>

          {/* 4. अपवाद */}
          {hasExclusions && <section className="flat-section" id="apvad">
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailExclusions : s.title + ' के ' + t.detailExclusions}</h2>
            <h3>{pageLang === 'en' ? 'Who is excluded, and what needs checking?' : 'कौन पात्र नहीं है और किन बातों की जाँच चाहिए?'}</h3>
            {pageLang === 'en' && s.exclusionsEn && s.exclusionsEn.length > 0 ? (
              <ul className="flat-list">
                {s.exclusionsEn.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : s.exclusions && s.exclusions.length > 0 ? (
              <ul className="flat-list">
                {s.exclusions.map((exc, idx) => <li key={idx}>{exc}</li>)}
              </ul>
            ) : null}
          </section>}

          {/* 5. आवेदन प्रक्रिया */}
          {hasProcess && <section className="flat-section" id="aavedan">
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailProcess : s.title + ' की ' + t.detailProcess}</h2>

            {pageLang === 'en' && s.applicationProcessEn && s.applicationProcessEn.length > 0 ? (
              <div>
                {s.applicationProcessEn.map((proc, i) => (
                  <div key={i} style={{marginBottom:20}}>
                    <div className="tabs-header" style={{borderBottom:'2px solid #e2e8f0', marginBottom:15}}>
                      <h3 className="tab-btn active" style={{borderBottom:'2px solid #3182ce', color:'#3182ce', background:'none', border:'none', padding:'8px 16px', fontWeight:600}}>{proc.mode}</h3>
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
                      <h3 className="tab-btn active" style={{borderBottom:'2px solid #3182ce', color:'#3182ce', background:'none', border:'none', padding:'8px 16px', fontWeight:600}}>{proc.mode}</h3>
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
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailDocuments : s.title + ' के लिए ' + t.detailDocuments}</h2>
            <p>{pageLang === 'en' ? 'Check which documents apply to your application in the current official form. Conditional documents are not required from everyone.' : 'वर्तमान सरकारी प्रपत्र से मिलाएँ कि आपके मामले में कौन-सा दस्तावेज़ लागू है। किसी खास श्रेणी के लिए माँगा गया प्रमाण हर आवेदक के लिए जरूरी नहीं होता।'}</p>
            {hasDocuments && <ul className="flat-list">
              {displayDocuments.map((doc,idx)=>(
                <li key={idx}>{doc}</li>
              ))}
            </ul>}
          </section>}

          {/* Mobile Only: Trending Links (Before FAQs) */}
          <div className="mobile-only-trending" style={{marginTop: '30px', marginBottom: '30px', padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px'}}>
            <h2 style={{fontSize: '1.2rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '15px'}}>{pageLang === 'en' ? 'Trending Schemes' : 'ट्रेंडिंग योजनाएं'}</h2>
            <ul style={{listStyle: 'none', paddingLeft: 0, margin: 0}}>
              <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-awas-gramin" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Awas Yojana Gramin List 2026 (NEW) - Download PDF</Link></li>
              <li style={{marginBottom: '12px'}}><Link href="/yojna/mukhyamantri-majhi-ladki-bahin-yojana" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>Majhi Ladki Bahin Yojana - Online Apply & Status Check</Link></li>
              <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-kisan" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Kisan Samman Nidhi Yojana 24th Installment Date</Link></li>
              <li style={{marginBottom: '12px'}}><Link href="/yojna/ayushman-bharat" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>Ayushman Bharat Yojana: Download Card & Check Hospital List</Link></li>
              <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-surya-ghar" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Surya Ghar Muft Bijli Yojana - Online Registration</Link></li>
            </ul>
          </div>

          {/* 7. अधिकतर पूछे जाने वाले सवाल */}
          <section className="flat-section" id="faqs">
            <h2 className="flat-section-heading">{pageLang === 'en' ? s.english + ' ' + t.detailFaqs : s.title + ' के ' + t.detailFaqs}</h2>
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
              {!displayFaqs.length && <p className="verification-needed">{pageLang === 'en' ? 'Scheme-specific FAQs are not available yet. Check the official source for current rules.' : 'इस योजना के विशेष सवाल-जवाब अभी उपलब्ध नहीं हैं। वर्तमान नियम आधिकारिक स्रोत में देखें।'}</p>}
            </div>
            {s.slug === 'gobardhan-scheme' && displayFaqs.length > 0 && <div className="faq-sources">
              <p><strong>सवाल-जवाब के आधिकारिक स्रोत</strong> · जाँच: 3 अक्टूबर 2026</p>
              <ul className="flat-list">{gobardhanFaqSources.map(source => <li key={source.url}><a className="inline-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
            </div>}
          </section>

          <div data-nosnippet=""><WhatsAppShareBanner title={pageLang === 'en' ? s.english : s.title} slug={s.slug}/></div>

          <section className="flat-section" style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0'}}>
            <h2 className="flat-section-heading" style={{fontSize: '1.1rem'}}>{pageLang === 'en' ? 'Help others by sharing this guide' : 'इस जानकारी को दूसरों तक पहुँचाएं (Share & Link)'}</h2>
            <p style={{fontSize: '0.95rem', marginBottom: '10px'}}>{pageLang === 'en' ? 'If you found this guide helpful, please share it on social media or link to it from your blog/website to help others find accurate information.' : 'अगर आपको यह जानकारी मददगार लगी, तो इसे अपने दोस्तों के साथ शेयर करें या अपनी वेबसाइट/ब्लॉग पर लिंक देकर दूसरों की मदद करें।'}</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px dashed #cbd5e1'}}>
              <code style={{flex: 1, fontSize: '0.85rem', wordBreak: 'break-all', color: '#475569'}}>{`${SITE_URL}/yojna/${s.slug}`}</code>
              <button onClick={() => {navigator.clipboard.writeText(`${SITE_URL}/yojna/${s.slug}`); alert('Link copied!');}} style={{background: '#e2e8f0', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600}}>Copy Link</button>
            </div>
          </section>

          {/* 8. स्रोत और संदर्भ */}
          <section className="flat-section" id="sandarbh">
            <h2 className="flat-section-heading">{t.detailSources}</h2>
            <ul className="flat-list" style={{listStyle:'none', paddingLeft:0}}>
              <li><b>{t.nodalDept}</b> {s.department}</li>
              <li><b>{t.officialSource}</b> {s.sourceUrl ? <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{color:'#3182ce', textDecoration:'underline'}} onClick={() => { import('@/components/site').then(m => m.track('official_link_clicked')); }}>{new URL(s.sourceUrl).hostname}</a> : t.notAvailable}</li>
            </ul>
            <p><strong>{pageLang === 'en' ? 'Last independent editorial review: ' : 'अंतिम स्वतंत्र संपादकीय समीक्षा: '}</strong>{s.editorial?.reviewedAt ? new Date(s.editorial.reviewedAt).toLocaleDateString(pageLang === 'en' ? 'en-IN' : 'hi-IN') : (t.statusLabels?.[s.status as keyof typeof t.statusLabels] || (s.status === 'ACTIVE' ? (pageLang === 'en' ? 'Active' : 'सक्रिय') : (pageLang === 'en' ? 'Verification Pending' : 'सत्यापन बाकी')))}</p>
            <p>{s.sourceNotes}</p><p><Link className="inline-link" href="/contact">{pageLang === 'en' ? 'Report an error or request a correction' : 'जानकारी में गलती बताएं या सुधार भेजें'}</Link></p>
            <ol className="flat-list">
              {s.references?.map((ref,i) => <li key={ref.url + i} style={{marginBottom:18}}>
                <a className="inline-link" href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title} ↗</a>
                <p>{ref.organization} · संबंधित भाग: {ref.sections.join(', ')}</p>
                <p><small>{ref.accessedAt ? `स्रोत देखा: ${new Date(ref.accessedAt).toLocaleDateString('hi-IN')}` : 'इस संपादन में स्रोत की नई स्वतंत्र जाँच बाकी है।'}</small></p>
                {ref.note && <p>{ref.note}</p>}
              </li>)}
            </ol>
            <p>{pageLang === 'en' ? 'Sarkari Yojana is an independent information website. Final eligibility is determined by the respective department.' : 'Sarkari Yojana एक स्वतंत्र सूचना वेबसाइट है। अंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।'}</p>
          </section>

          <section className="flat-section author-bio" style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #e2e8f0'}}>
            <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#334155', fontSize: '1.2rem'}}>
              {AUTHOR_NAME.charAt(0)}
            </div>
            <div>
              <p style={{margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#0f172a'}}>
                {AUTHOR_LINKEDIN_URL ? <a href={AUTHOR_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{color: '#0f172a', textDecoration: 'none'}}>{AUTHOR_NAME}</a> : AUTHOR_NAME}
              </p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#475569'}}>{AUTHOR_ROLE}</p>
            </div>
          </section>

          {relatedGuides.length > 0 && <section className="flat-section">
            <h2 className="flat-section-heading">{pageLang === 'en' ? 'Documents and Application Prep' : 'दस्तावेज़ और आवेदन की तैयारी'}</h2>
            <p>{pageLang === 'en' ? 'These are general information guides. Check required documents against the current official rules of the scheme.' : 'ये सामान्य जानकारी के गाइड हैं। आवश्यक दस्तावेज़ योजना के वर्तमान आधिकारिक नियमों से मिलाएँ।'}</p>
            <ul className="flat-list">{relatedGuides.map(g => <li key={g.slug}><Link className="inline-link" href={`/guide/${g.slug}`}>{g.title}</Link></li>)}</ul>
          </section>}
          <SchemeFeedback slug={s.slug} title={pageLang === 'en' ? s.english : s.title} english={pageLang === 'en'}/>


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

