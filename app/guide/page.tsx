import {DEFAULT_OG_IMAGE} from '@/lib/config';
import Link from 'next/link';
import {BookOpen,ArrowRight} from 'lucide-react';
import {PageTitle} from '@/components/site';
import {guides} from '@/lib/guides';
export const metadata={title:'सरकारी योजना के आसान गाइड',description:'सरकारी दस्तावेज़, आवेदन की तैयारी और ऑनलाइन सुरक्षा को सरल हिन्दी में समझें।',alternates:{canonical:'/guide'},openGraph:{title:'सरकारी योजना के आसान गाइड',description:'दस्तावेज़ और आवेदन प्रक्रिया समझने के सरल गाइड।',url:'/guide',type:'website' as const,locale:'hi_IN',images:[DEFAULT_OG_IMAGE]}};
export default function Page(){return <main id="main" className="page-wrap"><PageTitle eyebrow="आसान गाइड" title="जानकारी से शुरू होती है आसानी।" description="सरकारी शब्दों और दस्तावेज़ों को सरल हिन्दी में समझें। ये सामान्य तैयारी गाइड हैं; राज्य की वर्तमान प्रक्रिया की अलग से पुष्टि करें।"/><div className="scheme-grid">{guides.map(g=><article className="panel" key={g.slug}><BookOpen color="#498460"/><p className="small" style={{margin:'15px 0'}}>{g.category}</p><h2>{g.title}</h2><p className="small">{g.description}</p><Link className="text-button" style={{marginTop:20}} href={'/guide/'+g.slug}>गाइड पढ़ें <ArrowRight size={16}/></Link></article>)}</div></main>;}
