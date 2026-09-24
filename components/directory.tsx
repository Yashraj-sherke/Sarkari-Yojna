'use client';
import type { SchemeSummary } from '@/lib/scheme-summary';
import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, LockKeyhole, Sparkles, RotateCcw, BookOpen, HelpCircle, ArrowLeft } from 'lucide-react';
import { categories, searchSchemes } from '@/lib/domain';
import { Sidebar, Card, Empty, Choice, icons, SampleNotice, track, Search, ArrowRight, ShieldCheck, MapPin } from './site';
import { useLanguage } from '@/lib/i18n';
import { ProcessFlow } from './process-flow';


export function Directory({ schemes, initialCategory = 'all', initialState = 'all', isHomePage = false }: { schemes: SchemeSummary[]; initialCategory?: string; initialState?: string; isHomePage?: boolean }) {
  const { t, lang } = useLanguage();

  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState(initialState);
  const [category, setCategory] = useState(initialCategory);
  const [verified, setVerified] = useState(false);
  const [page, setPage] = useState(1);

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setPage(1);
    } else {
      isMounted.current = true;
    }
  }, [query, category, state, verified]);
  const reviewed = (s: SchemeSummary) => s.status === 'ACTIVE' && !s.isSample && s.editorial?.publicationStatus === 'REVIEWED';
  const routeCategory = categories.find(c => c.id === initialCategory);
  const routeTitle = routeCategory ? `${routeCategory.name} की सरकारी योजनाएं` : initialState === 'madhya-pradesh' ? 'मध्य प्रदेश की सरकारी योजनाएं' : null;
  const isCentralFeatured = isHomePage && state === 'central' && !query && category === 'all';
  const found = useMemo(() => {
    const list = searchSchemes(schemes, query, category, state).filter(s => !verified || reviewed(s));
    if (isCentralFeatured) {
      return list.slice(0, 9);
    }
    return list;
  }, [schemes, query, category, state, verified, isCentralFeatured]);
  const CARDS_PER_PAGE = 9;
  const totalPages = Math.ceil(found.length / CARDS_PER_PAGE);
  const displayedSchemes = found.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
  return <>
    <div className="workspace"><Sidebar category={initialCategory} /><main id="main" className="directory">
      <nav className="breadcrumb" aria-label="breadcrumb"><Link href="/">{t.breadcrumbHome}</Link>{routeTitle && <> <span>/</span> <span aria-current="page">{routeTitle}</span></>}</nav>
      <section className="discovery">
        <div className="discovery-copy">
          <div className="hero-kicker"><span /> {t.heroBadge}</div>
          <h1>{routeTitle ?? <>Sarkari Yojana<br /><span>{lang === 'hi' ? 'सरकारी योजनाओं की सरल जानकारी' : 'Understand government schemes'}</span></>}</h1>
          <p>{t.heroDesc.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
          {isHomePage && <>
            <p>{lang === 'hi' ? 'Sarkari Yojana (सरकारी योजना), sarkariyojanasetu.com पर एक स्वतंत्र नागरिक सूचना मंच है। इसे Sarkari Yojana Setu नाम से भी पहचान सकते हैं। यह सरकारी वेबसाइट नहीं है। अभी केंद्र और मध्य प्रदेश की योजनाओं पर जानकारी उपलब्ध है।' : 'Sarkari Yojana, also known as Sarkari Yojana Setu, is an independent citizen-information platform at sarkariyojanasetu.com. It currently covers Central and Madhya Pradesh schemes and is not a government website.'}</p>
            <nav aria-label="योजनाएं खोजने के तरीके" style={{display:'flex',flexWrap:'wrap',gap:'12px 24px',marginBottom:16}}>
              <a href="#scheme-search" className="inline-link">योजना खोजें</a>
              <Link href="/mere-liye" className="inline-link">मेरे लिए योजनाएं</Link>
              <Link href="/state/madhya-pradesh" className="inline-link">मध्य प्रदेश की योजनाएं</Link>
              <a href="#scheme-categories" className="inline-link">श्रेणी के अनुसार खोजें</a>
            </nav>
          </>}
          <form className="search-box" onSubmit={e => { e.preventDefault(); setQuery(q); if (q && isHomePage && state === 'central') { setState('all'); } track('search_performed'); }}>
            <div className="search-brand-mark" title="Sarkari Yojana">
              <Image
                src="/search-logo.webp"
                alt="Sarkari Yojana Emblem"
                className="search-logo-img"
                width={33}
                height={47}
                priority={true}
              />
            </div>
            <Search size={18} className="search-glass-icon" />
            <input id="scheme-search" aria-label={t.searchPlaceholder} placeholder={t.searchPlaceholder} value={q} onChange={e => { setQ(e.target.value); if (!e.target.value) setQuery(''); }} />
            <button type="submit">{t.searchBtn} <ArrowRight size={17} /></button>
          </form>
          <div className="suggestions">
            <span>{t.searchSuggest}</span>
            {t.searchTags.map(tag => <button key={tag} onClick={() => { setQ(tag); setQuery(tag); if (isHomePage && state === 'central') { setState('all'); } track('search_performed'); }}>{tag}</button>)}
          </div>
        </div>
      </section>

      <div className="match-box">
        <span className="match-icon"><Sparkles size={26} /></span>
        <div className="match-content">
          <span className="small-label">{t.matchStart}</span>
          <h2>{t.matchTitle.split('\n').join(' ')}</h2>
          <p>{t.matchDesc.split('\n').join(' ')}</p>
        </div>
        <div className="match-action">
          <Link className="btn" href="/mere-liye">{t.matchBtn} <ArrowRight size={17} /></Link>
          <span className="match-privacy"><LockKeyhole size={13} /> {t.matchPrivacy}</span>
        </div>
      </div>
      <div className="trust-strip">
        <span><ShieldCheck />{t.trustSource}</span>
        <span><BookOpen />{t.trustSimple}</span>
        <span><LockKeyhole />{t.trustPrivacy}</span>
      </div>


      <section id="scheme-categories" className="categories-section">
        <div className="section-heading">
          <div><h2>{t.categoryHeading}</h2><p>{t.categorySubtext}</p></div>
          <button className="text-button" onClick={() => { setCategory('all'); setQuery(''); setQ(''); }}>{t.allCategories} <ArrowRight size={16} /></button>
        </div>
        <div className="category-grid">
          {categories.map(c => { const Icon = icons[c.icon]; return <Link href={category === c.id ? '/' : '/category/' + c.id} key={c.id} className={'category-tile ' + (category === c.id ? 'chosen' : '')} onClick={() => { track('category_opened'); }} aria-current={category === c.id ? 'page' : undefined}><span className={'category-icon ' + c.color}><Icon size={24} /></span><span>{c.short}</span></Link>; })}
        </div>
      </section>
      <section className="results-section">
        <div className="section-heading">
          <div>
            <h2>{query ? `"${query}" ${t.resultsFor}` : isCentralFeatured ? (lang === 'hi' ? 'केंद्र सरकार की प्रमुख 9 योजनाएं' : 'Top 9 Central Government Schemes') : category === 'all' ? t.resultsDefault : categories.find(c => c.id === category)?.name}</h2>
            <p>{isCentralFeatured ? (lang === 'hi' ? 'केंद्रीय योजनाएं · लागू क्षेत्र और पात्रता हर योजना के नियमों के अनुसार' : 'Central schemes · Coverage and eligibility depend on scheme rules') : `${found.length} ${t.resultsSuffix}`}</p>
          </div>
          <div className="filter-select">
            <MapPin size={17} />
            <Choice label={t.stateFilter} value={state} onChange={(val) => {
              if (val === 'madhya-pradesh') window.location.href = '/state/madhya-pradesh';
              else if (val === 'central') window.location.href = '/state/central';
              else if (val === 'all') window.location.href = '/';
              else setState(val);
            }} options={[
              { value: 'central', label: lang === 'hi' ? 'केंद्र सरकार (9)' : 'Central Schemes (9)' },
              { value: 'madhya-pradesh', label: lang === 'hi' ? 'मध्य प्रदेश' : 'Madhya Pradesh' },
              { value: 'all', label: t.stateAll },
              { value: 'other', label: t.stateOther },
            ]} />
          </div>
        </div>
        <div className="filter-bar">
          <SlidersHorizontal size={16} />
          <button className={!verified ? 'filter-chip active' : 'filter-chip'} onClick={() => setVerified(false)}>{t.filterAll}</button>
          <button className={verified ? 'filter-chip active' : 'filter-chip'} onClick={() => setVerified(true)}>{t.filterVerified}</button>
          {(query || category !== 'all' || state !== (isHomePage ? 'central' : 'all')) && <button className="reset" onClick={() => { setCategory('all'); setState(isHomePage ? 'central' : 'all'); setQ(''); setQuery(''); }}><RotateCcw size={13} /> {t.filterReset}</button>}
          <span className="sample-label">{schemes.filter(reviewed).length} {t.verifiedCount}</span>
        </div>
        {schemes.some(s => s.isSample) && <SampleNotice />}
        <p className="source-review-note">{t.sourceNote}</p>
        {found.length ? <>
          <div className="scheme-grid">{displayedSchemes.map(s => <Card key={s.slug} s={s} />)}</div>
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <button className="btn" disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }} style={page === 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}} aria-label="Previous Page"><ArrowLeft size={17} /></button>
              <span style={{ fontWeight: 600 }}>{lang === 'hi' ? `पृष्ठ ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
              <button className="btn" disabled={page === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }} style={page === totalPages ? { opacity: 0.5, cursor: 'not-allowed' } : {}} aria-label="Next Page"><ArrowRight size={17} /></button>
            </div>
          )}
        </> : <Empty description={verified ? t.emptyVerifiedDesc : undefined} />}
      </section>

    </main>
    </div>
    <ProcessFlow lang={lang} />
    <section className="faq-section">
        <div className="faq-image">
          <Image src="/faq-illustration.webp" alt="FAQ Illustration" width={400} height={300} style={{ width: '100%', height: 'auto' }} sizes="(max-width: 768px) 100vw, 400px" />
        </div>
        <div className="faq-content">
          <h2><HelpCircle size={22} /> {t.faqTitle}</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>{t.faq1Q}</summary>
              <p>{t.faq1A}</p>
            </details>
            <details className="faq-item">
              <summary>{t.faq2Q}</summary>
              <p>{t.faq2A}</p>
            </details>
            <details className="faq-item">
              <summary>{t.faq3Q}</summary>
              <p>{t.faq3A}</p>
            </details>
            <details className="faq-item">
              <summary>{t.faq4Q}</summary>
              <p>{t.faq4A}</p>
            </details>
          </div>
        </div>
      </section>
  </>;
}
