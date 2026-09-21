import {notFound} from 'next/navigation';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
export const revalidate = 3600;
export const metadata={title:'मध्य प्रदेश की योजनाएं',alternates:{canonical:'/state/madhya-pradesh'}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(id!=='madhya-pradesh')notFound();return <Directory schemes={await allSchemes()} initialState={id}/>;}
