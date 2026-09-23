import {Admin} from '@/components/admin';
import {adminIdentity} from '@/lib/server';
import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {PageTitle} from '@/components/site';
export const dynamic='force-dynamic';
export const metadata={title:'व्यवस्थापक',robots:{index:false,follow:false},alternates:{canonical:'/admin'}};
export default async function Page(){if(await adminIdentity())return <Admin/>;const user=await getChatGPTUser();return <main id="main" className="page-wrap"><PageTitle eyebrow="सुरक्षित समीक्षा डेस्क" title="व्यवस्थापक प्रवेश" description="योजनाओं का संपादन केवल अधिकृत समीक्षक कर सकते हैं।"/><div className="panel">{user?<><h2>आप signed in हैं, लेकिन अभी समीक्षक नहीं हैं।</h2><p>सेवा संचालक को आपकी पहचान अनुमति-सूची में जोड़नी होगी।</p><p className="small">आपकी reviewer ID: <code>{user.userId}</code></p></>:<><p>अपनी अधिकृत पहचान से प्रवेश करें।</p><a className="btn" style={{marginTop:20}} href={chatGPTSignInPath('/admin')} target="_top">Sign in with ChatGPT</a></>}</div></main>;}
