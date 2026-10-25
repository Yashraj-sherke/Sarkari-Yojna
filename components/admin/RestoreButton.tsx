'use client';
import { useRouter } from 'next/navigation';
import type { AdminResponse } from '@/lib/admin-response';
import { useState } from 'react';
export function RestoreButton({id,slug,version}:{id:string;slug:string;version:number}){const router=useRouter();const[error,setError]=useState('');return <><button className="text-indigo-700" onClick={async()=>{if(!confirm('इस संस्करण को working draft में लगाएँ? Live article नहीं बदलेगा।'))return;try{const response=await fetch('/admin/api/restore',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,slug,version})});const result=await response.json() as AdminResponse;if(!response.ok)throw new Error(result.error);router.push(`/admin/schemes/edit/${slug}`);}catch(error){setError((error as Error).message);}}}>Draft में पुनर्स्थापित करें</button><span role="alert">{error}</span></>;}


