'use client';
import { useRouter } from 'next/navigation';
import type { AdminResponse } from '@/lib/admin-response';
import { useState } from 'react';
export function LoginForm() { const router=useRouter();
  const [error,setError]=useState(''), [busy,setBusy]=useState(false), [show,setShow]=useState(false);
  return <form className="space-y-4" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError(''); const values = new FormData(e.currentTarget);
    try { const response=await fetch('/admin-login/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:values.get('email'),password:values.get('password')})});
      const result=await response.json() as AdminResponse; if(!response.ok) throw new Error(result.error || 'प्रवेश विफल'); router.push('/admin');
    } catch(error) {setError((error as Error).message);} finally {setBusy(false);}
  }}><label className="block">ईमेल<input name="email" type="email" autoComplete="username" required className="block border rounded p-2 w-full"/></label><label className="block">पासवर्ड<input name="password" type={show?'text':'password'} autoComplete="current-password" required maxLength={200} className="block border rounded p-2 w-full"/></label><label><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/> पासवर्ड दिखाएँ</label><p role="alert">{error}</p><button className="btn" disabled={busy}>{busy?'प्रवेश जारी…':'प्रवेश करें'}</button></form>;
}


