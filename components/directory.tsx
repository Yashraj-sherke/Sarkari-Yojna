'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {SlidersHorizontal,LockKeyhole,Sparkles,RotateCcw,BookOpen} from 'lucide-react';
import {categories,searchSchemes,type Scheme} from '@/lib/domain';
import {Sidebar,Card,Empty,Choice,icons,SampleNotice,track,Search,ArrowRight,ShieldCheck,MapPin} from './site';
import {useLanguage} from '@/lib/i18n';

export function Directory({schemes,initialCategory='all',initialState='all',isHomePage=false}:{schemes:Scheme[];initialCategory?:string;initialState?:string;isHomePage?:boolean}){
const {t,lang}=useLanguage();
const [q,setQ]=useState(''),[query,setQuery]=useState(''),[state,setState]=useState(initialState),[category,setCategory]=useState(initialCategory),[verified,setVerified]=useState(false);
const isCentralFeatured = isHomePage && state === 'central' && !query && category === 'all';
const found=useMemo(()=>{
  const list = searchSchemes(schemes,query,category,state).filter(s=>!verified||s.status==='ACTIVE');
  if (isCentralFeatured) {
    return list.slice(0, 9);
  }
  return list;
},[schemes,query,category,state,verified,isCentralFeatured]);
return <div className="workspace"><Sidebar category={initialCategory}/><main id="main" className="directory">
  <div className="breadcrumb">{t.breadcrumbHome} <span>/</span> {t.breadcrumbSearch} <span className="edition">{t.breadcrumbEdition}</span></div>
  <section className="discovery">
    <div className="discovery-copy">
      <div className="hero-kicker"><span/> {t.heroBadge}</div>
      <h1>{t.heroTitle}<br/><span>{t.heroSubtitle}</span></h1>
      <p>{t.heroDesc.split('\n').map((line,i)=><span key={i}>{line}{i===0&&<br/>}</span>)}</p>
      <form className="search-box" onSubmit={e=>{e.preventDefault();setQuery(q);track('search_performed');}}>
        <Search size={22}/>
        <input aria-label={t.searchPlaceholder} placeholder={t.searchPlaceholder} value={q} onChange={e=>{setQ(e.target.value);if(!e.target.value)setQuery('');}}/>
        <button type="submit">{t.searchBtn} <ArrowRight size={17}/></button>
      </form>
      <div className="suggestions">
        <span>{t.searchSuggest}</span>
        {t.searchTags.map(tag=><button key={tag} onClick={()=>{setQ(tag);setQuery(tag);track('search_performed');}}>{tag}</button>)}
      </div>
    </div>
    <div className="match-box">
      <span className="match-icon"><Sparkles size={27}/></span>
      <span className="small-label">{t.matchStart}</span>
      <h2>{t.matchTitle.split('\n').map((line,i)=><span key={i}>{line}{i===0&&<br/>}</span>)}</h2>
      <p>{t.matchDesc.split('\n').map((line,i)=><span key={i}>{line}{i===0&&<br/>}</span>)}</p>
      <Link className="btn" href="/mere-liye">{t.matchBtn} <ArrowRight size={17}/></Link>
      <span className="match-privacy"><LockKeyhole size={13}/> {t.matchPrivacy}</span>
    </div>
  </section>
  <div className="trust-strip">
    <span><ShieldCheck/>{t.trustSource}</span>
    <span><BookOpen/>{t.trustSimple}</span>
    <span><LockKeyhole/>{t.trustPrivacy}</span>
  </div>
  <section className="categories-section">
    <div className="section-heading">
      <div><h2>{t.categoryHeading}</h2><p>{t.categorySubtext}</p></div>
      <button className="text-button" onClick={()=>{setCategory('all');setQuery('');setQ('');}}>{t.allCategories} <ArrowRight size={16}/></button>
    </div>
    <div className="category-grid">
      {categories.map(c=>{const Icon=icons[c.icon];return <button key={c.id} className={'category-tile '+(category===c.id?'chosen':'')} onClick={()=>{setCategory(category===c.id?'all':c.id);track('category_opened');}} aria-pressed={category===c.id}><span className={'category-icon '+c.color}><Icon size={24}/></span><span>{c.short}</span></button>;})}
    </div>
  </section>
  <section className="results-section">
    <div className="section-heading">
      <div>
        <h2>{query?`"${query}" ${t.resultsFor}`:isCentralFeatured?(lang==='hi'?'केंद्र सरकार की प्रमुख 9 योजनाएं':'Top 9 Central Government Schemes'):category==='all'?t.resultsDefault:categories.find(c=>c.id===category)?.name}</h2>
        <p>{isCentralFeatured?(lang==='hi'?'9 प्रमुख योजनाएं उपलब्ध · पूरे भारत में मान्य':'9 Flagship Central Schemes · Valid Across India'):`${found.length} ${t.resultsSuffix}`}</p>
      </div>
      <div className="filter-select">
        <MapPin size={17}/>
        <Choice label={t.stateFilter} value={state} onChange={setState} options={[
          {value:'central',label:lang==='hi'?'केंद्र सरकार (9)':'Central Schemes (9)'},
          {value:'madhya-pradesh',label:lang==='hi'?'मध्य प्रदेश (129+)':'Madhya Pradesh (129+)'},
          {value:'all',label:t.stateAll},
          {value:'other',label:t.stateOther},
        ]}/>
      </div>
    </div>
    <div className="filter-bar">
      <SlidersHorizontal size={16}/>
      <button className={!verified?'filter-chip active':'filter-chip'} onClick={()=>setVerified(false)}>{t.filterAll}</button>
      <button className={verified?'filter-chip active':'filter-chip'} onClick={()=>setVerified(true)}>{t.filterVerified}</button>
      {(query||category!=='all'||state!==(isHomePage ? 'central' : 'all'))&&<button className="reset" onClick={()=>{setCategory('all');setState(isHomePage ? 'central' : 'all');setQ('');setQuery('');}}><RotateCcw size={13}/> {t.filterReset}</button>}
      <span className="sample-label">{schemes.filter(s=>s.status==='ACTIVE').length} {t.verifiedCount}</span>
    </div>
    {schemes.some(s=>s.isSample)&&<SampleNotice/>}
    <p className="source-review-note">{t.sourceNote}</p>
    {found.length?<div className="scheme-grid">{found.map(s=><Card key={s.slug} s={s}/>)}</div>:<Empty description={verified?t.emptyVerifiedDesc:undefined}/>}
    {isCentralFeatured && (
      <section className="guide-banner" style={{marginTop:'28px',background:'#edf5ee',borderColor:'#cbe0ce'}}>
        <MapPin size={30} style={{color:'#206d44'}}/>
        <div>
          <h2 style={{color:'#164f32'}}>{lang==='hi'?'मध्य प्रदेश की योजनाएं खोज रहे हैं?':'Looking for Madhya Pradesh Schemes?'}</h2>
          <p style={{color:'#3f6b4f'}}>{lang==='hi'?'लाड़ली बहना, सीखो कमाओ, संबल और किसान कल्याण सहित MP की सभी 129+ योजनाएं देखें।':'Explore 129+ MP state government schemes with full checklists & steps.'}</p>
        </div>
        <Link href="/state/madhya-pradesh" style={{background:'#176247',color:'white',padding:'10px 18px',borderRadius:'6px',fontWeight:600}}>
          {lang==='hi'?'MP की सभी 129+ योजनाएं देखें':'View 129+ MP Schemes'} <ArrowRight size={17}/>
        </Link>
      </section>
    )}
  </section>
  <section className="guide-banner">
    <BookOpen size={30}/>
    <div><h2>{t.guideBannerTitle}</h2><p>{t.guideBannerDesc}</p></div>
    <Link href="/guide">{t.guideBannerLink} <ArrowRight size={18}/></Link>
  </section>
</main></div>;
}
