'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function GenerateDraftButton({kind='news'}:{kind?:'news'|'scheme'}){
 const[busy,setBusy]=useState(false),[error,setError]=useState('');const router=useRouter();
 return <div><button type="button" disabled={busy} className="btn" onClick={async()=>{if(!confirm('Configured AI provider से unverified draft बनाएँ? Provider usage charges लागू हो सकते हैं।'))return;setBusy(true);setError('');try{const response=await fetch(`/admin/api/generate-${kind}-draft`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const result=await response.json() as {slug:string;error?:string;issues?:unknown};if(!response.ok)throw new Error(result.error+(result.issues?JSON.stringify(result.issues):''));router.push(`/admin/${kind==='news'?'news':'schemes'}/edit/${result.slug}`);}catch(error){setError((error as Error).message);}finally{setBusy(false);}}}>{busy?'AI draft बन रहा है…':'AI से unverified draft लें'}</button><p role="alert">{error}</p></div>;
}
