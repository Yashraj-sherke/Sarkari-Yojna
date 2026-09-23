import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
export const revalidate = 3600;
export const metadata={title:'मध्य प्रदेश की सरकारी योजनाएं',description:'मध्य प्रदेश सरकार की योजनाओं के लाभ, पात्रता, दस्तावेज़, आवेदन प्रक्रिया और आधिकारिक स्रोत देखें।',alternates:{canonical:'/state/madhya-pradesh'},openGraph:{title:'मध्य प्रदेश की सरकारी योजनाएं',description:'मध्य प्रदेश सरकार की योजनाओं की सरल हिन्दी जानकारी।',url:'/state/madhya-pradesh',type:'website' as const,locale:'hi_IN'}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(id!=='madhya-pradesh')notFound();return <Directory schemes={(await allSchemes()).map(summarizeScheme)} initialState={id}/>;}
