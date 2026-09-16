'use client';
import Link from 'next/link';
import {OfficialImage} from './official-image';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat,ArrowUpRight,ArrowRight,ShieldCheck,MapPin,Menu,Search,Users,Bookmark,Bell,Compass,Info,Check,ChevronRight,Languages} from 'lucide-react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {categories,statusLabels,type Scheme} from '@/lib/domain';
import {useLanguage} from '@/lib/i18n';
export const icons={Sprout,HeartHandshake,GraduationCap,HeartPulse,House,BriefcaseBusiness,Accessibility,Wheat};
// Re-export shared icons so other 'use client' components avoid a separate lucide chunk
export {Search,ArrowRight,ShieldCheck,MapPin};
export async function api<T>(path:string,data?:unknown,method='POST'):Promise<T>{const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});const b=await r.json() as T & {error?:string};if(!r.ok)throw Error(b.error??'कुछ गलत हुआ। फिर कोशिश करें।');return b;}
export function track(name:string){void api('/api/events',{name}).catch(()=>{});}
export function Choice({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}){return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="choice"><SelectValue placeholder={label}/></SelectTrigger><SelectContent position="popper">{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;}

export function Header(){
  const path=usePathname();
  const [open,setOpen]=useState(false);
  const {t,lang,toggleLang}=useLanguage();
  return <>
    <a className="skip" href="#main">{lang==='hi'?'मुख्य सामग्री पर जाएं':'Skip to main content'}</a>
    <div className="independent">
      <div><ShieldCheck size={14}/>{t.independent}</div>
      <span>{t.yourInfo}</span>
    </div>
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark"><Sprout size={27}/></span>
        <span>{t.brandName}<small>{t.brandTagline}</small></span>
      </Link>
      <nav aria-label={lang==='hi'?'मुख्य नेविगेशन':'Main navigation'} className={open?'nav open':'nav'}>
        {[
          {href:'/',label:t.navSearch},
          {href:'/mere-liye',label:t.navForMe},
          {href:'/family',label:t.navFamily},
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
  const {t}=useLanguage();
  return <footer className="footer">
    <div className="footer-brand"><Sprout size={22}/><b>{t.footerTagline}</b></div>
    <p>{t.footerDisclaimer}</p>
    <div className="footer-bottom">
      <span>{t.footerFree}</span>
      <nav>
        <Link href="/privacy">{t.footerPrivacy}</Link>
        <Link href="/terms">{t.footerTerms}</Link>
        <Link href="/disclaimer">{t.footerDisclaimer2}</Link>
        <Link href="/admin">{t.footerAdmin}</Link>
      </nav>
    </div>
  </footer>;
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

export function Status({s}:{s:Scheme}){
  const {t}=useLanguage();
  return <span className={'status '+(s.status==='ACTIVE'?'verified':'')}><span/>{t.statusLabels[s.status as keyof typeof t.statusLabels]??statusLabels[s.status]}</span>;
}

export function Card({s}:{s:Scheme}){
  const {t}=useLanguage();
  const cat=categories.find(c=>c.id===s.category)!;
  const Icon=icons[cat.icon];
  return <article className="scheme-card">
    <OfficialImage slug={s.slug} scheme={s}/>
    <div className="card-top">
      <span className={'category-icon '+cat.color}><Icon size={23}/></span>
      <span className="scope"><MapPin size={13}/>{s.state==='central'?t.centralGov:t.mpGov}</span>
    </div>
    <Link href={'/yojna/'+s.slug} className="card-title"><h3>{s.title}</h3></Link>
    <p className="english">{s.english}</p>
    <p className="card-summary">{s.summary}</p>
    <div className="benefit"><Check size={16}/><span>{s.benefit}</span></div>
    <div className="card-bottom"><Status s={s}/><Link href={'/yojna/'+s.slug} aria-label={s.title}><ArrowRight size={20}/></Link></div>
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
