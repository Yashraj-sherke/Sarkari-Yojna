'use client';
import type { SchemeSummary } from '@/lib/scheme-summary';
import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, LockKeyhole, Sparkles, RotateCcw, BookOpen, HelpCircle, ArrowLeft, BadgeCheck, ClipboardList, FileSearch, IndianRupee, ListChecks, KeyRound, Landmark, Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories, searchSchemes } from '@/lib/domain';
import { Sidebar, Card, Empty, Choice, icons, SampleNotice, track, Search, ArrowRight, ShieldCheck, MapPin } from './site';
import { useLanguage } from '@/lib/i18n';
import { OfficialImage } from './official-image';
import { stateNames } from '@/lib/state-names';
import { trendingLinksHindi, stateSchemesLinks } from '@/lib/trending-data';
import { ProcessFlow } from './process-flow';
import { NewSchemeBadge } from './new-scheme-badge';

const answerPaths = [
  { icon: BadgeCheck, hi: 'क्या मैं पात्र हूँ?', en: 'Am I eligible?', href: '/mere-liye' },
  { icon: ClipboardList, hi: 'आवेदन कैसे करें?', en: 'How do I apply?', href: '/guide/safe-application' },
  { icon: FileSearch, hi: 'कौन से दस्तावेज़ चाहिए?', en: 'Which documents are needed?', href: '/praman-patr' },
  { icon: ListChecks, hi: 'स्थिति या सूची देखें', en: 'Check status or list', href: '/status-directory' },
  { icon: KeyRound, hi: 'PM-KISAN e-KYC', en: 'PM-KISAN e-KYC', href: '/yojna/pm-kisan' },
  { icon: IndianRupee, hi: 'PM-KISAN किस्त/भुगतान', en: 'PM-KISAN payments', href: '/yojna/pm-kisan' },
  { icon: Landmark, hi: 'आधिकारिक पोर्टल', en: 'Official portals', href: '/status-directory' },
  { icon: HelpCircle, hi: 'आवेदन में समस्या', en: 'Application problems', href: '/guide' },
] as const;

function RecentUpdates({ news, lang }: { news: any[]; lang: string }) {
  if (!news || news.length === 0) return null;
  return (
    <div className="sarkari-ticker">
      <div className="sarkari-ticker-label">
        {lang === 'hi' ? 'हाल के सत्यापित अपडेट' : 'Verified Updates'}
      </div>
      <div className="sarkari-ticker-marquee">
        <div className="sarkari-ticker-content">
          {news.map((n, i) => (
            <span key={n.slug}>
              {i > 0 && <span className="sarkari-ticker-divider">|</span>}
              <Link href={`/samachar/${n.slug}`} className="sarkari-ticker-link">
                {n.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


function DirectoryContent({ schemes, centralSchemes, initialCategory = 'all', initialState = 'all', initialPage = 1, paginationBasePath = '/yojna', isHomePage = false, latestNews }: { schemes: SchemeSummary[]; centralSchemes?: SchemeSummary[]; initialCategory?: string; initialState?: string; initialPage?: number; paginationBasePath?: string; isHomePage?: boolean; latestNews?: any[] }) {
  const { t, lang } = useLanguage();


  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState(initialState);
  const [category, setCategory] = useState(initialCategory);
  const [verified, setVerified] = useState(false);
  const [page, setPage] = useState(initialPage);
  const isMounted = useRef(false);
  const router = useRouter();

  useEffect(() => setPage(initialPage), [initialPage]);
  useEffect(() => {
    if (isMounted.current) {
      setPage(1);
    } else {
      isMounted.current = true;
    }
  }, [query, category, state, verified]);
  const reviewed = (s: SchemeSummary) => s.status === 'ACTIVE' && !s.isSample && s.editorial?.publicationStatus === 'REVIEWED';
  const routeCategory = categories.find(c => c.id === initialCategory);
  
  let routeTitle = null;
  let stateDisplayName = null;
  if (routeCategory) {
    routeTitle = `${routeCategory.name} की सरकारी योजनाएं`;
  } else if (initialState && initialState !== 'all' && initialState !== 'central' && stateNames[initialState as keyof typeof stateNames]) {
    stateDisplayName = stateNames[initialState as keyof typeof stateNames];
    routeTitle = `${stateDisplayName} की सरकारी योजनाएं`;
  }
  
  const stateLogos: Record<string, string> = {
    'madhya-pradesh': '/cm-logos/mp-cm.png',
    'uttar-pradesh': '/state-logos/up-logo.svg',
    'bihar': '/cm-logos/bihar-cm.png',
    'maharashtra': '/cm-logos/mh-cm.png',
    'rajasthan': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seal_of_Rajasthan.png',
    'haryana': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Seal_of_Haryana.svg',
    'gujarat': '/cm-logos/gj-cm.png',
    'punjab': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Seal_of_Punjab.svg',
    'chhattisgarh': '/cm-logos/cg-cm.png',
    'jharkhand': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Jharkhand_Rajakiya_Chihna.jpg',
    'karnataka': '/state-logos/ka-logo.svg'
  };
  const isFeatured = isHomePage && state === 'all' && !query && category === 'all';
  const uniqueList = Array.from(new Map(schemes.map(s => [s.slug, s])).values());
  const found = useMemo(() => {
    const list = searchSchemes(uniqueList, query, category, state).filter(s => !verified || reviewed(s));
    return list;
  }, [uniqueList, query, category, state, verified]);

  const mpSchemes = isFeatured ? found.filter(s => s.state !== 'central') : found;
  const centralOnly = found.filter(s => s.state === 'central');

  const CARDS_PER_PAGE = 9;
  
  const trendingSlugs = ['mukhyamantri-kanya-vivah-yojana', 'gobardhan-scheme', 'ladli-behna', 'pm-awas-gramin', 'pm-kisan', 'ayushman-bharat', 'pm-surya-ghar', 'pm-vishwakarma'];
  
  const displayedMpSchemes = isFeatured 
    ? [
        ...trendingSlugs.flatMap(slug => found.filter(s => s.slug === slug)),
        ...found.filter(s => !trendingSlugs.includes(s.slug)),
      ].slice(0, CARDS_PER_PAGE)
    : mpSchemes.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
  const totalPages = Math.ceil(mpSchemes.length / CARDS_PER_PAGE);
  return <>
    <main id="main" className="directory">
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <nav className="breadcrumb" aria-label="breadcrumb"><Link href="/">{t.breadcrumbHome}</Link>{routeTitle && <> <span>/</span> <span aria-current="page">{routeTitle}</span></>}</nav>

      {isHomePage ? (
        <>
          <section className="discovery home-discovery">
            <div className="discovery-copy">
              <div className="hero-kicker"><span /> {t.heroBadge}</div>
              <h1>Sarkari Yojana<br /><span>{lang === 'hi' ? 'सरकारी योजनाओं की सरल जानकारी' : 'Understand government schemes'}</span></h1>
              <div className="hero-desc">{t.heroDesc.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</div>
              <div className="hero-desc-sub">{lang === 'hi' ? 'Sarkari Yojana (सरकारी योजना), sarkariyojanasetu.com पर एक स्वतंत्र नागरिक सूचना मंच है। इसे Sarkari Yojana Setu नाम से भी पहचान सकते हैं। यह सरकारी वेबसाइट नहीं है। अभी केंद्र और मध्य प्रदेश की योजनाओं पर जानकारी उपलब्ध है।' : 'Sarkari Yojana, also known as Sarkari Yojana Setu, is an independent citizen-information platform at sarkariyojanasetu.com. It currently covers Central and Madhya Pradesh schemes and is not a government website.'}</div>
              
              <form className="search-box" onSubmit={e => { e.preventDefault(); setQuery(q); if (q && state === 'central') { setState('all'); } track('search_performed'); }}>
                <div className="search-brand-mark" title="Search Government Schemes on Sarkari Yojana">
                  <Image
                    src="/search-logo-optimized.webp"
                    alt="Sarkari Yojana Search Portal Logo - Find Government Schemes"
                    title="Sarkari Yojana Search"
                    className="search-logo-img"
                    width={33}
                    height={47}
                    priority={true}
                    sizes="33px"
                  />
                </div>
                <Search size={18} className="search-glass-icon" />
                <input id="scheme-search" aria-label={t.searchPlaceholder} placeholder={t.searchPlaceholder} value={q} onChange={e => { setQ(e.target.value); if (!e.target.value) setQuery(''); }} />
                <button type="submit">{t.searchBtn} <ArrowRight size={17} /></button>
              </form>
              <div className="suggestions">
                <span>{t.searchSuggest}</span>
                {t.searchTags.map(tag => <button key={tag} onClick={() => { setQ(tag); setQuery(tag); if (state === 'central') { setState('all'); } track('search_performed'); }}>{tag}</button>)}
              </div>
            </div>
          </section>

          <RecentUpdates news={latestNews ?? []} lang={lang} />
          
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

          <section id="scheme-categories" className="categories-section">
            <div className="section-heading">
              <div><h2>{t.categoryHeading}</h2><p>{t.categorySubtext}</p></div>
              <button className="text-button" onClick={() => { setCategory('all'); setQuery(''); setQ(''); }}>{t.allCategories} <ArrowRight size={16} /></button>
            </div>
            <div className="category-grid">
              {categories.map(c => { const Icon = icons[c.icon]; return <Link href={category === c.id ? '/' : '/category/' + c.id} key={c.id} className={'category-tile ' + (category === c.id ? 'chosen' : '')} onClick={() => { track('category_opened'); }} aria-current={category === c.id ? 'page' : undefined}><span className={'category-icon ' + c.color}><Icon size={24} /></span><span>{c.short}</span></Link>; })}
            </div>
          </section>
        </>
      ) : (
        <div className="state-page-header" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {initialState && stateLogos[initialState] && (
              <img src={stateLogos[initialState]} alt={`${stateDisplayName} State Emblem`} style={{ height: '64px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
            )}
            {routeTitle}
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
            {lang === 'hi' 
              ? `${stateDisplayName || (routeCategory ? routeCategory.name : '')} सरकार की नवीनतम सामाजिक कल्याण योजनाओं की जानकारी और अपडेट।` 
              : `Latest social welfare schemes news, information and updates for ${stateDisplayName || (routeCategory ? routeCategory.name : '')}.`}
          </p>
        </div>
      )}
      {isFeatured && (
        <section className="sarkari-three-col-section">
          <div className="sarkari-three-col">
            {/* Column 1: Trendy */}
            <div className="sarkari-col">
              <h2 className="sarkari-col-header">{lang === 'hi' ? 'सबसे ज्यादा खोजी गई योजनाएं' : 'Most Searched'}</h2>
              <ul className="sarkari-col-list">
                {trendingLinksHindi.map((link, idx) => (
                  <li key={idx}><Link href={link.href}>{link.label}<NewSchemeBadge href={link.href} /></Link></li>
                ))}
              </ul>
              <div className="sarkari-col-footer">
                <Link href="/yojna">{lang === 'hi' ? 'और देखें »' : 'View more »'}</Link>
              </div>
            </div>

            {/* Column 2: State */}
            <div className="sarkari-col">
              <h2 className="sarkari-col-header">{lang === 'hi' ? 'राज्य की योजनाएं' : 'State Schemes'}</h2>
              <ul className="sarkari-col-list">
                {stateSchemesLinks.map((link, idx) => (
                  <li key={idx}><Link href={link.href}>{link.label}<NewSchemeBadge href={link.href} /></Link></li>
                ))}
              </ul>
              <div className="sarkari-col-footer">
                <Link href="/yojna">{lang === 'hi' ? 'और देखें »' : 'View more »'}</Link>
              </div>
            </div>

            {/* Column 3: Central */}
            <div className="sarkari-col">
              <h2 className="sarkari-col-header">{lang === 'hi' ? 'केंद्र सरकार की योजनाएं' : 'Central Schemes'}</h2>
              <ul className="sarkari-col-list">
                <li><Link href="/yojna/pm-kisan">पीएम किसान सम्मान निधि</Link></li>
                <li><Link href="/yojna/pm-surya-ghar">पीएम सूर्य घर: मुफ्त बिजली योजना</Link></li>
                <li><Link href="/yojna/pm-ujjwala">प्रधानमंत्री उज्ज्वला योजना 2.0</Link></li>
                <li><Link href="/yojna/sukanya-samriddhi">सुकन्या समृद्धि योजना (SSY)</Link></li>
                <li><Link href="/yojna/pm-mudra">प्रधानमंत्री मुद्रा योजना (PMMY)</Link></li>
                <li><Link href="/yojna/atal-pension">अटल पेंशन योजना (APY)</Link></li>
              </ul>
              <div className="sarkari-col-footer">
                <Link href="/state/central">{lang === 'hi' ? 'और देखें »' : 'View more »'}</Link>
              </div>
            </div>
          </div>
        </section>
      )}
      </div>

      <div className={'workspace right-sidebar-layout'+(isHomePage?' home-workspace':'')} style={{maxWidth:'1400px', margin:'0 auto'}}>
        <div className="main-content" style={{ order: 1 }}>
          <section className="results-section" style={{ marginTop: '20px' }}>

        <div className="section-heading">
          <div>
            <h2>{query ? `"${query}" ${t.resultsFor}` : isFeatured ? (lang === 'hi' ? 'ट्रेंडिंग सरकारी योजनाएं' : 'Trending Government Schemes') : category === 'all' ? t.resultsDefault : categories.find(c => c.id === category)?.name}</h2>
            <p>{isFeatured ? (lang === 'hi' ? 'सबसे ज्यादा खोजी गई योजनाएं' : 'Most searched schemes') : `${found.length} ${t.resultsSuffix}`}</p>
          </div>
          <div className="filter-select">
            <MapPin size={17} />
            <Choice label={t.stateFilter} value={state} onChange={(val) => {
              if (val === 'all') router.push('/');
              else if (val === 'other') setState(val);
              else router.push(`/state/${val}`);
            }} options={[
              { value: 'central', label: lang === 'hi' ? 'केंद्र सरकार' : 'Central Schemes', iconUrl: '/favicon-32x32.png' },
              { value: 'uttar-pradesh', label: lang === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh', iconUrl: stateLogos['uttar-pradesh'] },
              { value: 'bihar', label: lang === 'hi' ? 'बिहार' : 'Bihar', iconUrl: stateLogos['bihar'] },
              { value: 'madhya-pradesh', label: lang === 'hi' ? 'मध्य प्रदेश' : 'Madhya Pradesh', iconUrl: stateLogos['madhya-pradesh'] },
              { value: 'maharashtra', label: lang === 'hi' ? 'महाराष्ट्र' : 'Maharashtra', iconUrl: stateLogos['maharashtra'] },
              { value: 'rajasthan', label: lang === 'hi' ? 'राजस्थान' : 'Rajasthan', iconUrl: stateLogos['rajasthan'] },
              { value: 'haryana', label: lang === 'hi' ? 'हरियाणा' : 'Haryana', iconUrl: stateLogos['haryana'] },
              { value: 'chhattisgarh', label: lang === 'hi' ? 'छत्तीसगढ़' : 'Chhattisgarh', iconUrl: stateLogos['chhattisgarh'] },
              { value: 'all', label: t.stateAll },
              { value: 'other', label: t.stateOther },
            ]} />
          </div>
        </div>
        {mpSchemes.length > 0 ? <>
          <div className="sarkari-list-view">
            {displayedMpSchemes.map((s, idx) => {
              const cat = categories.find(c => c.id === s.category) || categories[0];
              return (
                <div key={s.slug} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link prefetch={false} href={'/yojna/'+s.slug} className="sarkari-list-item blog-style">
                    <div className="sarkari-list-image">
                      <OfficialImage slug={s.slug} scheme={s} priority={false} sizes="(max-width: 680px) 100px, 180px" />
                    </div>
                    <div className="sarkari-list-content">
                      <h3 className="sarkari-list-title">{lang === 'en' ? s.english : s.title}</h3>
                      {s.lastUpdated && <div className="sarkari-list-date">{new Date(s.lastUpdated).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
                      <p className="sarkari-list-desc">{lang === 'en' ? (s.summaryEn ?? s.summary) : s.summary}</p>
                      <div className="sarkari-list-badges">
                        {s.state === 'madhya-pradesh' && <span className="sarkari-list-badge state">{lang === 'hi' ? 'मध्य प्रदेश' : 'MP'}</span>}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          

          {totalPages > 1 && !isFeatured && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {page > 1 ? (
                <Link className="btn" href={page === 2 ? paginationBasePath : `${paginationBasePath}?page=${page - 1}`} aria-label="Previous Page" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} style={{ padding: '0', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf3eb', color: '#166534', border: 'none', borderRadius: '4px' }}><ArrowLeft size={14} /></Link>
              ) : (
                <span className="btn" style={{ opacity: 0.5, cursor: 'not-allowed', padding: '0', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf3eb', color: '#166534', border: 'none', borderRadius: '4px' }}><ArrowLeft size={14} /></span>
              )}
              {(() => {
                const getVisiblePages = (current: number, total: number) => {
                  if (total <= 5) return Array.from({length: total}, (_, i) => i + 1);
                  if (current <= 3) return [1, 2, 3, 4, '...', total];
                  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
                  return [1, '...', current - 1, current, current + 1, '...', total];
                };
                
                return getVisiblePages(page, totalPages).map((p, i) => {
                  if (p === '...') {
                    return <span key={`dots-${i}`} style={{ padding: '0 2px', opacity: 0.6, fontSize: '12px' }}>...</span>;
                  }
                  const pageNumber = p as number;
                  const isActive = pageNumber === page;
                  return (
                    <Link
                      key={pageNumber}
                      className="btn"
                      href={pageNumber === 1 ? paginationBasePath : `${paginationBasePath}?page=${pageNumber}`}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={isActive ? 'page' : undefined}
                      style={{ 
                        padding: '0', minWidth: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', borderRadius: '4px', border: 'none',
                        backgroundColor: isActive ? '#166534' : '#eaf3eb',
                        color: isActive ? '#ffffff' : '#166534'
                      }}
                    >{pageNumber}</Link>
                  );
                });
              })()}
              {page < totalPages ? (
                <Link className="btn" href={`${paginationBasePath}?page=${page + 1}`} aria-label="Next Page" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} style={{ padding: '0', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf3eb', color: '#166534', border: 'none', borderRadius: '4px' }}><ArrowRight size={14} /></Link>
              ) : (
                <span className="btn" style={{ opacity: 0.5, cursor: 'not-allowed', padding: '0', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf3eb', color: '#166534', border: 'none', borderRadius: '4px' }}><ArrowRight size={14} /></span>
              )}
            </div>
          )}
        </> : <Empty description={verified ? t.emptyVerifiedDesc : undefined} />}

        {isFeatured && centralOnly.length > 0 && (
          <div style={{marginTop: '50px'}}>
            <div className="section-heading">
              <div>
                <h2>{lang === 'hi' ? 'केंद्र सरकार की योजनाएं' : 'Central Government Schemes'}</h2>
                <p>{lang === 'hi' ? 'ये योजनाएं आपके राज्य में भी पूरी तरह लागू हैं' : 'These schemes are also available in your state'}</p>
              </div>
            </div>
            <div className="sarkari-list-view">
              {centralOnly.slice(0, isFeatured ? 5 : undefined).map((s, idx) => {
                const cat = categories.find(c => c.id === s.category) || categories[0];
                return (
                  <div key={s.slug} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link prefetch={false} href={'/yojna/'+s.slug} className="sarkari-list-item blog-style">
                      <div className="sarkari-list-image">
                        <OfficialImage slug={s.slug} scheme={s} priority={false} sizes="160px" />
                      </div>
                      <div className="sarkari-list-content">
                        <h3 className="sarkari-list-title">{lang === 'en' ? s.english : s.title}</h3>
                        {s.lastUpdated && <div className="sarkari-list-date">{new Date(s.lastUpdated).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
                        <p className="sarkari-list-desc">{lang === 'en' ? (s.summaryEn ?? s.summary) : s.summary}</p>
                        <div className="sarkari-list-badges">
                          <span className="sarkari-list-badge central">{lang === 'hi' ? 'केंद्र सरकार' : 'Central'}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            {isFeatured && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link href="/state/central" className="btn">{lang === 'hi' ? 'सभी केंद्र सरकार योजनाएं देखें' : 'View all Central Schemes'} <ArrowRight size={17}/></Link>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Mobile Only: Trending Links (Before FAQs) */}
      {!isHomePage && (
        <div className="mobile-only-trending" style={{marginTop: '30px', marginBottom: '30px', padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px'}}>
          <h2 style={{fontSize: '1.2rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '15px'}}>{lang === 'hi' ? 'ट्रेंडिंग योजनाएं' : 'Trending Schemes'}</h2>
          <ul style={{listStyle: 'none', paddingLeft: 0, margin: 0}}>
            <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-awas-gramin" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Awas Yojana Gramin List 2026 (NEW) - Download PDF</Link></li>
            <li style={{marginBottom: '12px'}}><Link href="/yojna/mukhyamantri-majhi-ladki-bahin-yojana" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>Majhi Ladki Bahin Yojana - Online Apply & Status Check</Link></li>
            <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-kisan" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Kisan Samman Nidhi Yojana 24th Installment Date</Link></li>
            <li style={{marginBottom: '12px'}}><Link href="/yojna/ayushman-bharat" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>Ayushman Bharat Yojana: Download Card & Check Hospital List</Link></li>
            <li style={{marginBottom: '12px'}}><Link href="/yojna/pm-surya-ghar" style={{color: '#2563eb', fontWeight: 600, textDecoration: 'underline'}}>PM Surya Ghar Muft Bijli Yojana - Online Registration</Link></li>
          </ul>
        </div>
      )}

      </div>
      <Sidebar category={initialCategory} />
    </div>

    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <ProcessFlow lang={lang} />
      <section className="faq-section" style={{ paddingTop: '20px' }}>
        <div className="faq-content" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
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
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: t.faq1Q, acceptedAnswer: { '@type': 'Answer', text: t.faq1A } },
            { '@type': 'Question', name: t.faq2Q, acceptedAnswer: { '@type': 'Answer', text: t.faq2A } },
            { '@type': 'Question', name: t.faq3Q, acceptedAnswer: { '@type': 'Answer', text: t.faq3A } },
            { '@type': 'Question', name: t.faq4Q, acceptedAnswer: { '@type': 'Answer', text: t.faq4A } },
          ]
        }).replace(/</g,'\\u003c')}}/>
      </section>
    </div>
  </main>
  </>;
}

export function Directory(props: any) {
  return <DirectoryContent {...props} />;
}
