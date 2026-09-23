'use client';
import type { SchemeSummary } from '@/lib/scheme-summary';
import Link from 'next/link';
import {OfficialImage} from './official-image';
import {Suspense, useState, useEffect} from 'react';
import Image from 'next/image';
import {Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat,ArrowUpRight,ArrowRight,ShieldCheck,MapPin,Menu,Search,Users,Bookmark,Bell,Compass,Info,Check,ChevronRight,Languages,FileText,BookOpen,AlertCircle,Mail} from 'lucide-react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {categories,statusLabels,type Scheme} from '@/lib/domain';
import {useLanguage} from '@/lib/i18n';
import {SITE_NAME_EN, SITE_NAME_HI, SITE_TAGLINE} from '@/lib/config';
import {CardWhatsAppShare} from './whatsapp-share';
export const icons={Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat};
// Re-export shared icons so other 'use client' components avoid a separate lucide chunk
export {Search,ArrowRight,ShieldCheck,MapPin};
export async function api<T>(path:string,data?:unknown,method='POST'):Promise<T>{const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});const b=await r.json() as T & {error?:string};if(!r.ok)throw Error(b.error??'कुछ गलत हुआ। फिर कोशिश करें।');return b;}
export function track(name:string){void api('/api/events',{name}).catch(()=>{});}
export function Choice({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}){return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="choice"><SelectValue placeholder={label}/></SelectTrigger><SelectContent position="popper">{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;}

export function Header(){
  const [path,setPath]=useState('');
  useEffect(()=>setPath(window.location.pathname),[]);
  const [open,setOpen]=useState(false);
  const {t,lang,toggleLang}=useLanguage();
  return <>
    <a className="skip" href="#main">{lang==='hi'?'मुख्य सामग्री पर जाएं':'Skip to main content'}</a>
    <div className="independent">
      <div><ShieldCheck size={14}/>{t.independent}</div>
      <span>{t.yourInfo}</span>
    </div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label={t.brandName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="/navbar-logo.webp"
          alt="Sarkari Yojna Logo"
          className="navbar-brand-logo"
          width={860}
          height={524}
          priority={true}
          unoptimized={true}
        />
      </Link>
      <nav aria-label={lang==='hi'?'मुख्य नेविगेशन':'Main navigation'} className={open?'nav open':'nav'}>
        {[
          {href:'/',label:t.navSearch},
          {href:'/mere-liye',label:t.navForMe},
          {href:'/guide',label:t.navGuide},
        ].map(n=><Link onClick={()=>setOpen(false)} className={path===n.href?'active':''} key={n.href} href={n.href}>{n.label}</Link>)}
      </nav>
      <div className="header-end">
        <button
          onClick={toggleLang}
          className="lang-toggle"
          aria-label={lang==='hi'?'Switch to English':'हिन्दी में देखें'}
          title={lang==='hi'?'Switch to English':'हिन्दी में देखें'}
        >
          <Languages size={16}/>
          <span>{lang==='hi'?'EN':'हि'}</span>
        </button>
        <Link href="/saved" className="icon-link" aria-label={t.navSaved}><Bookmark size={20}/></Link>
        <Link href="/reminders" className="icon-link" aria-label={t.navReminders}><Bell size={20}/></Link>
        <button className="mobile-menu icon-link" aria-label={t.navMenu} aria-expanded={open} onClick={()=>setOpen(!open)}><Menu/></button>
      </div>
    </header>
  </>;
}

export function Footer(){
  return (
    <footer className="portal-gov-footer" role="contentinfo">
      <div className="portal-footer-inner">
        {/* Top 4-Column Grid matching user mockup */}
        <div className="portal-footer-grid">
          
          {/* Column 1: Brand, Logo & Tagline */}
          <div className="portal-footer-col brand-col">
            <div className="portal-brand-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', marginBottom: '20px' }}>
              <Image
                src="/sarkari-yojana-map-logo.webp"
                alt="Sarkari Yojna Logo"
                className="portal-map-logo"
                width={200}
                height={100}
                priority={true}
                unoptimized={true}
                style={{ objectFit: 'contain', width: '100%', maxWidth: '220px', height: 'auto', marginBottom: '-55px' }}
              />
              <div className="portal-brand-text" style={{ marginTop: '0px', textAlign: 'center', maxWidth: '260px' }}>
                <p className="portal-brand-desc" style={{ fontSize: '0.92rem', color: '#2d3748', opacity: 0.95, lineHeight: '1.5', fontWeight: 600 }}>
                  {SITE_TAGLINE}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: त्वरित लिंक */}
          <div className="portal-footer-col">
            <h3 className="portal-col-title">
              त्वरित लिंक
              <span className="title-bar" />
            </h3>
            <ul className="portal-link-list">
              <li>
                <Link href="/">
                  <Search size={15} className="link-icon" />
                  <span>योजना खोज</span>
                </Link>
              </li>
              <li>
                <Link href="/mere-liye">
                  <Users size={15} className="link-icon" />
                  <span>मेरे लिए योजनाएं</span>
                </Link>
              </li>
              <li>
                <Link href="/praman-patr">
                  <FileText size={15} className="link-icon" />
                  <span>दस्तावेज़ मार्गदर्शिका</span>
                </Link>
              </li>
              <li>
                <Link href="/guide">
                  <BookOpen size={15} className="link-icon" />
                  <span>आवेदन कैसे करें</span>
                </Link>
              </li>
              <li>
                <Link href="/state/madhya-pradesh">
                  <MapPin size={15} className="link-icon" />
                  <span>मध्य प्रदेश की योजनाएं</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: महत्वपूर्ण */}
          <div className="portal-footer-col">
            <h3 className="portal-col-title">
              महत्वपूर्ण
              <span className="title-bar" />
            </h3>
            <ul className="portal-link-list">
              <li>
                <Link href="/about">
                  <Info size={15} className="link-icon" />
                  <span>हमारे बारे में</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <ShieldCheck size={15} className="link-icon" />
                  <span>गोपनीयता नीति</span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <FileText size={15} className="link-icon" />
                  <span>उपयोग के नियम</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer">
                  <AlertCircle size={15} className="link-icon" />
                  <span>अस्वीकरण</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={15} className="link-icon" style={{ flexShrink: 0 }} />
                  <span>संपर्क करें</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: अधिकृत सरकारी पोर्टल्स */}
          <div className="portal-footer-col portals-col">
            <h3 className="portal-col-title">
              अधिकृत सरकारी पोर्टल्स
              <span className="title-bar" />
            </h3>
            <div className="portal-cards-grid">
              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="gov-portal-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '6px 0' }}>
                <img src="https://www.google.com/s2/favicons?domain=india.gov.in&sz=32" alt="" className="portal-card-icon" width="18" height="18" style={{borderRadius:'2px', objectFit:'contain'}} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="portal-card-text">India.gov.in</span>
                <ArrowUpRight size={13} className="ext-icon" />
              </a>
              <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className="gov-portal-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '6px 0' }}>
                <img src="https://www.google.com/s2/favicons?domain=myscheme.gov.in&sz=32" alt="" className="portal-card-icon" width="18" height="18" style={{borderRadius:'2px', objectFit:'contain'}} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="portal-card-text">myScheme</span>
                <ArrowUpRight size={13} className="ext-icon" />
              </a>
              <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="gov-portal-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '6px 0' }}>
                <img src="https://www.google.com/s2/favicons?domain=pmkisan.gov.in&sz=32" alt="" className="portal-card-icon" width="18" height="18" style={{borderRadius:'2px', objectFit:'contain'}} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="portal-card-text">PM-KISAN</span>
                <ArrowUpRight size={13} className="ext-icon" />
              </a>
              <a href="https://mp.gov.in/" target="_blank" rel="noopener noreferrer" className="gov-portal-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '6px 0' }}>
                <img src="https://www.google.com/s2/favicons?domain=mp.gov.in&sz=32" alt="" className="portal-card-icon" width="18" height="18" style={{borderRadius:'2px', objectFit:'contain'}} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="portal-card-text">MP.gov.in</span>
                <ArrowUpRight size={13} className="ext-icon" />
              </a>
            </div>

            <div className="portal-security-note" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: '10px 0', borderTop: '1px solid rgba(22, 79, 57, 0.1)', marginTop: '20px' }}>
              <span className="lock-icon">🔒</span>
              <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>
                <strong>सुरक्षा:</strong> कभी भी किसी अज्ञात व्यक्ति के साथ बैंक OTP, UPI पिन या गोपनीय पासवर्ड साझा न करें!
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Disclaimer on left, Social Media in center, Copyright on right */}
        <div className="portal-footer-bottom">
          <div className="footer-disclaimer-text">
            <strong>{SITE_NAME_EN}</strong> एक स्वतंत्र सूचना प्लेटफ़ॉर्म है। यह भारत सरकार या किसी राज्य सरकार की आधिकारिक वेबसाइट नहीं है। योजनाओं की अंतिम पात्रता, लाभ और आवेदन प्रक्रिया संबंधित सरकारी विभाग/पोर्टल द्वारा निर्धारित की जाती है।
          </div>

          <div className="footer-social-cluster" aria-label="सोशल मीडिया लिंक्स">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-pill youtube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-pill x-twitter" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-pill facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-pill instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

          <div className="footer-copyright-block">
            <span className="copy-title">© 2026 {SITE_NAME_EN}</span>
            <span className="copy-sub">सभी अधिकार सुरक्षित</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Sidebar({category='all'}:{category?:string}){
  const {t}=useLanguage();
  return <aside className="sidebar">
    <p className="eyebrow">{t.sidebarForYou}</p>
    <Link className={category==='all'?'side-item selected':'side-item'} href="/"><Compass size={19}/>{t.navSearch}<ChevronRight size={15}/></Link>
    <Link className="side-item" href="/state/madhya-pradesh"><MapPin size={19}/>{t.stateMP}<span style={{marginLeft:'auto',fontSize:'0.7rem',background:'#eaf3eb',padding:'2px 7px',borderRadius:'10px',color:'#1d694c',fontWeight:700}}>129+</span></Link>
    <Link className="side-item" href="/mere-liye"><Users size={19}/>{t.navForMe}</Link>
    <Link className="side-item" href="/saved"><Bookmark size={19}/>{t.navSaved}</Link>
    <Link className="side-item" href="/reminders"><Bell size={19}/>{t.navReminders}</Link>
    <div className="side-rule"/>
    <p className="eyebrow">{t.sidebarByCategory}</p>
    {categories.map(c=>{const Icon=icons[c.icon];return <Link onClick={()=>track('category_opened')} href={'/category/'+c.id} key={c.id} className={'side-item '+(category===c.id?'selected':'')}><Icon size={18}/>{c.short}</Link>})}
    <div className="sidebar-help">
      <ShieldCheck size={24}/>
      <h3>{t.sidebarSafetyTitle}</h3>
      <p>{t.sidebarSafetyDesc}</p>
      <Link href="/disclaimer">{t.sidebarSafetyLink} <ArrowUpRight size={14}/></Link>
    </div>
  </aside>;
}

export function Status({s}:{s:Pick<Scheme, 'status'>}){
  const {t}=useLanguage();
  return <span className={'status '+(s.status==='ACTIVE'?'verified':'')}><span/>{t.statusLabels[s.status as keyof typeof t.statusLabels]??statusLabels[s.status]}</span>;
}

export function Card({s}:{s:SchemeSummary}){
  const {t, lang}=useLanguage();
  const cat=categories.find(c=>c.id===s.category)!;
  const Icon=icons[cat.icon];
  return <article className="scheme-card">
    <OfficialImage slug={s.slug} scheme={s}/>
    <div className="card-top">
      <span className={'category-icon '+cat.color}><Icon size={23}/></span>
      <span className="scope"><MapPin size={13}/>{s.state==='central'?t.centralGov:t.mpGov}</span>
    </div>
    <Link prefetch={false} href={'/yojna/'+s.slug} className="card-title"><h3>{lang === 'en' ? s.english : s.title}</h3></Link>
    <p className="english">{s.english}</p>
    
    <div className="card-extended-details">
      {s.lastUpdated && <div style={{fontSize: '0.75rem', color: '#805313', marginBottom: 8}}>{t.lastUpdate} {new Date(s.lastUpdated).toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN')}</div>}
      <div className="card-detail-section">
        <h4 className="detail-heading"><FileText size={15}/> {t.glanceTitle}</h4>
        <p className="card-summary">{lang === 'en' ? (s.summaryEn ?? s.summary) : s.summary}</p>
      </div>
      
      <div className="card-detail-section">
        <h4 className="detail-heading"><Check size={15}/> {t.benefitLabel}</h4>
        <p className="card-benefit-text">{lang === 'en' ? (s.benefitEn ?? s.benefit) : s.benefit}</p>
      </div>
      
      {s.documents && s.documents.length > 0 && (
        <div className="card-detail-section">
          <h4 className="detail-heading"><BookOpen size={15}/> {t.docsTitle}</h4>
          <ul className="card-doc-list">
            {s.documents.slice(0, 3).map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
            {s.documents.length > 3 && (
              <li className="more-docs">+ {s.documents.length - 3} {lang === 'hi' ? 'और' : 'more'}</li>
            )}
          </ul>
        </div>
      )}
    </div>

    <div className="card-bottom"><Status s={s}/><Link prefetch={false} href={'/yojna/'+s.slug} aria-label={s.title}><ArrowRight size={20}/></Link></div>
  </article>;
}

export function Empty({title,description}:{title?:string;description?:string}){
  const {t}=useLanguage();
  return <div className="empty">
    <Search size={32}/>
    <h2>{title??t.emptyDefault}</h2>
    <p>{description??t.emptyDesc}</p>
    <Link className="btn secondary" href="/">{t.emptyLink} <ArrowRight size={17}/></Link>
  </div>;
}

export function PageTitle({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
  return <div className="page-heading"><p className="eyebrow green-text">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>;
}

export function SampleNotice(){
  const {t}=useLanguage();
  return <div className="sample-note"><Info size={17}/><span><b>{t.sampleNotice}</b> {t.sampleNoticeText}</span></div>;
}
