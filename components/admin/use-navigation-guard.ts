'use client';
import { useEffect } from 'react';
export function useNavigationGuard(dirty:boolean){useEffect(()=>{
 const guard=(event:MouseEvent)=>{if(!dirty||!(event.target instanceof Element))return;const link=event.target.closest('a');if(!link||link.target==='_blank'||link.getAttribute('href')?.startsWith('#'))return;if(!confirm('बदलाव अभी सहेजे नहीं गए हैं। इस पेज से बाहर जाएँ?')){event.preventDefault();event.stopImmediatePropagation();}};
 document.addEventListener('click',guard,true);return()=>document.removeEventListener('click',guard,true);
},[dirty]);}
