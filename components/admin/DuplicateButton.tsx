'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export function DuplicateButton({slug}:{slug:string}){const router=useRouter();const[error,setError]=useState('');return <><button type="button" onClick={async()=>{const newSlug=prompt('नए draft के लिए unique English slug लिखें:');if(!newSlug)return;try{const response=await fetch('/admin/api/duplicate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,newSlug})});const result=await response.json() as {error?:string;slug:string};if(!response.ok)throw new Error(result.error);router.push(`/admin/schemes/edit/${result.slug}`);}catch(error){setError((error as Error).message);}}}>नया draft duplicate करें</button><span role="alert">{error}</span></>;}

