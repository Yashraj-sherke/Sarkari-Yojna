'use client';
import { useId } from 'react';
export function Field({label,value,onChange,multiline=false,type='text',disabled=false}:{label:string;value:string;onChange:(v:string)=>void;multiline?:boolean;type?:string;disabled?:boolean}) {
  const id=useId(); const props={id,value,disabled,onChange:(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>onChange(e.target.value),className:'w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500'};
  return <label htmlFor={id} className="block text-sm space-y-1"><span>{label}</span>{multiline?<textarea {...props} rows={3}/>:<input {...props} type={type}/>}</label>;
}
export function Repeat({label,items,onChange}:{label:string;items:string[];onChange:(v:string[])=>void}) {
  return <fieldset className="space-y-2"><legend className="font-medium">{label}</legend>{items.map((value,index)=><div className="flex gap-2 items-end" key={index}><div className="flex-1"><Field label={`${label} ${index+1}`} value={value} onChange={v=>onChange(items.map((old,i)=>i===index?v:old))} multiline/></div><button type="button" aria-label={`ऊपर ${index+1}`} disabled={!index} onClick={()=>{const next=[...items];[next[index-1],next[index]]=[next[index],next[index-1]];onChange(next);}}>↑</button><button type="button" aria-label={`नीचे ${index+1}`} disabled={index===items.length-1} onClick={()=>{const next=[...items];[next[index+1],next[index]]=[next[index],next[index+1]];onChange(next);}}>↓</button><button type="button" aria-label={`हटाएँ ${index+1}`} onClick={()=>onChange(items.filter((_,i)=>i!==index))}>✕</button></div>)}<button type="button" className="text-indigo-700" onClick={()=>onChange([...items,''])}>+ जोड़ें</button></fieldset>;
}
