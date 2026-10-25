'use client';
import type { AdminResponse } from '@/lib/admin-response';
import { useState } from 'react';
import { permitted, type AdminRole, type WorkflowAction, type WorkflowState } from '@/lib/admin-policy';
export function Workflow({slug,version,state,role,dirty=false,news=false,published=state==='PUBLISHED'}:{slug:string;version:number;state:WorkflowState;role:AdminRole;dirty?:boolean;news?:boolean;published?:boolean}) {
  const [note,setNote]=useState(''),[checked,setChecked]=useState<string[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const options: [WorkflowAction,string][]=[];
  if(state==='DRAFT' && permitted(role,'edit')) options.push(['submit','समीक्षा हेतु भेजें']);
  if(state==='IN_REVIEW' && permitted(role,'review')) options.push(['approve','समीक्षा स्वीकृत करें'],['return','सुधार हेतु लौटाएँ']);
  if(state==='REVIEWED' && permitted(role,'review')) options.push(['return','सुधार हेतु लौटाएँ']);
  if(state==='REVIEWED' && permitted(role,'publish')) options.push(['publish','प्रकाशित करें']);
  if(published && state!=='ARCHIVED' && permitted(role,'publish')) options.push(['unpublish','प्रकाशन हटाएँ'],['archive','संग्रहित करें']);
  if(state==='ARCHIVED' && permitted(role,'publish')) options.push(['restore','नया draft बनाएँ']);
  const labels={benefits:'लाभ',eligibility:'पात्रता',documents:'दस्तावेज़',application:'आवेदन प्रक्रिया',sources:'स्रोत, तिथियाँ और विरोधाभास',schemeStatus:'योजना की वर्तमान संचालन स्थिति'};
  return <section className="rounded-xl border bg-white p-5 space-y-3"><h2 className="font-semibold">संपादकीय कार्यप्रवाह: {state} · संस्करण {version}</h2><p className="text-sm">Draft save करने से प्रकाशित संस्करण नहीं बदलता। बदलाव होने पर दोबारा समीक्षा आवश्यक है।</p>{state==='IN_REVIEW' && permitted(role,'review') && Object.entries(labels).map(([key,label])=><label key={key} className="block"><input type="checkbox" checked={checked.includes(key)} onChange={e=>setChecked(e.target.checked?[...checked,key]:checked.filter(x=>x!==key))}/> आधिकारिक स्रोत से {label} की पुष्टि की है</label>)}<label className="block">कार्य / समीक्षा का कारण<textarea className="border rounded p-2 w-full" value={note} onChange={e=>setNote(e.target.value)}/></label><p role="alert">{error}</p><div className="flex flex-wrap gap-2">{options.map(([action,label])=><button key={action} type="button" className="btn" disabled={busy||dirty||!version} onClick={async()=>{
    if(!window.confirm(`${label}?`)) return; setBusy(true);setError('');
    try {const response=await fetch(news?'/admin/api/news-workflow':'/admin/api/workflow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,version,action,note,evidence:action==='approve'?Object.fromEntries([...checked.map(key=>[key,true]),['note',note]]):undefined})});const result=await response.json() as AdminResponse;if(!response.ok)throw new Error(result.error + (result.issues?JSON.stringify(result.issues):''));window.location.reload();}catch(error){setError((error as Error).message);}finally{setBusy(false);}
  }}>{label}</button>)}</div>{dirty && <p>पहले बदलाव सहेजें।</p>}</section>;
}




