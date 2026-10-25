'use client';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field,Repeat } from './Fields';
import { safeArticleHtml } from '@/lib/safe-article';
import { Workflow } from './Workflow';
import { useNavigationGuard } from './use-navigation-guard';
import { permitted,type AdminRole,type WorkflowState } from '@/lib/admin-policy';
import type { NewsDraft } from '@/lib/admin-news';
import type { AdminResponse } from '@/lib/admin-response';
export default function SamacharEditor({initialData,version=0,workflow='DRAFT',role='EDITOR',published=false}:{initialData?:NewsDraft;version?:number;workflow?:WorkflowState;role?:AdminRole;published?:boolean}) {
 const[data,setData]=useState<NewsDraft>(initialData??{slug:'',title:'',summary:'',category:'योजना अपडेट',body:[],imageUrl:'',sourceUrl:'',sourceVerifiedAt:null,changes:'',affected:'',schemeSlugs:[]}),[note,setNote]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[dirty,setDirty]=useState(false);const router=useRouter(); useNavigationGuard(dirty);
 const change=<K extends keyof NewsDraft>(key:K,value:NewsDraft[K])=>{setData(old=>({...old,[key]:value}));setDirty(true);};
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty)e.preventDefault();};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 return <div className="space-y-5 max-w-5xl"><h1 className="text-2xl font-bold">समाचार संपादन</h1><Workflow news slug={data.slug} version={version} state={workflow} role={role} dirty={dirty} published={published}/><form className="space-y-4 bg-white border rounded p-5" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{const response=await fetch('/admin/api/samachar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data,version,oldSlug:initialData?.slug,note})});const result=await response.json() as AdminResponse;if(!response.ok)throw new Error(result.error+(result.issues?JSON.stringify(result.issues):''));setDirty(false);router.push(`/admin/news/edit/${result.slug}`);router.refresh();}catch(error){setError((error as Error).message);}finally{setBusy(false);}}}><fieldset disabled={!permitted(role,'edit')||workflow==='IN_REVIEW'||workflow==='ARCHIVED'||busy} className="space-y-4">{(['slug','title','summary','category','imageUrl','sourceUrl','sourceVerifiedAt','changes','affected'] as const).map(key=><Field key={key} label={key} value={data[key]??''} multiline={['summary','changes','affected'].includes(key)} disabled={key==='slug'&&!!initialData} onChange={value=>change(key,value as never)}/>)}<Repeat label="लेख के अनुच्छेद" items={data.body} onChange={value=>change('body',value)}/><Repeat label="संबंधित योजना slugs" items={data.schemeSlugs} onChange={value=>change('schemeSlugs',value)}/><Field label="बदलाव का कारण" value={note} onChange={setNote} multiline/><button className="btn">{busy?'सहेज रहे हैं…':'Draft सहेजें'}</button></fieldset><p role="alert" className="text-red-700">{error}</p></form><section className="bg-white border rounded p-5"><p className="bg-amber-100 p-2">निजी पूर्वावलोकन · Unsaved values · कोई प्रकाशन नहीं</p><h2 className="text-2xl font-bold mt-4">{data.title}</h2><p>{data.summary}</p>{data.body.map((part,index)=><div className="my-3 whitespace-pre-wrap" key={index} dangerouslySetInnerHTML={{__html:safeArticleHtml(part)}}/>)}</section></div>;
}



