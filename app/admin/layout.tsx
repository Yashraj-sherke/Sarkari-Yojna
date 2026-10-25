import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser, logoutAdmin } from '@/lib/admin-auth';
import { permitted } from '@/lib/admin-policy';
export const metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const user=await getAdminUser(); if(!user) redirect('/admin-login');
  const links=[['/admin','डैशबोर्ड'],['/admin/schemes','सभी योजनाएँ'],['/admin/news','समाचार'],['/admin/activity','गतिविधि लॉग'],['/admin/seo','SEO रिपोर्ट']];
  if(permitted(user.role,'edit')) links.push(['/admin/schemes/new','नई योजना'],['/admin/import','AI JSON इम्पोर्ट']);
  if(permitted(user.role,'users')) links.push(['/admin/users','यूज़र एवं रोल']);
  if(permitted(user.role,'settings')) links.push(['/admin/settings','सेटिंग्स']);
  return <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex"><aside className="bg-slate-900 text-white p-5 lg:w-64 shrink-0"><Link href="/admin" className="font-bold text-xl">Sarkari Yojana Setu</Link><details open className="mt-5"><summary className="cursor-pointer">प्रशासन मेनू</summary><nav aria-label="व्यवस्थापक" className="flex flex-wrap lg:flex-col gap-2 mt-3">{links.map(([href,label])=><Link key={href} href={href} className="rounded p-2 hover:bg-slate-800 focus:ring-2">{label}</Link>)}</nav></details><div className="mt-6 text-sm break-all">{user.email}<br/>{user.role}</div><form action={async()=>{'use server';await logoutAdmin();}}><button className="mt-3 text-red-200">लॉगआउट</button></form><Link href="/" className="block mt-4">सार्वजनिक वेबसाइट ↗</Link></aside><main id="main" className="min-w-0 flex-1 p-4 md:p-8">{children}</main></div>;
}
