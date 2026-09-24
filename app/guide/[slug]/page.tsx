import {DEFAULT_OG_IMAGE} from '@/lib/config';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {guides} from '@/lib/guides';
import {PageTitle} from '@/components/site';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);if(!g)notFound();return {title:g.title,description:g.description,alternates:{canonical:'/guide/'+slug},openGraph:{title:g.title,description:g.description,url:'/guide/'+slug,type:'article',locale:'hi_IN',images:[DEFAULT_OG_IMAGE]}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);if(!g)notFound();return <main id="main" className="page-wrap prose"><Link href="/guide">← सभी गाइड</Link><PageTitle eyebrow={g.category} title={g.title} description={g.description}/>{g.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<p className="small">यह सामान्य जानकारी है। यह किसी राज्य की पूर्ण या वर्तमान आवेदन प्रक्रिया होने का दावा नहीं करती।</p><Link className="btn secondary" href={g.related==='all'?'/':'/category/'+g.related}>संबंधित योजनाएं खोजें →</Link></main>;}
