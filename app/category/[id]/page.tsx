import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {categories} from '@/lib/domain';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
export const revalidate = 3600;
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const category=categories.find(c=>c.id===id);if(!category)return {title:'श्रेणी नहीं मिली',robots:{index:false}};const title=`${category.name} की सरकारी योजनाएं`;const description=`${category.name} से जुड़ी केंद्र और मध्य प्रदेश सरकार की योजनाओं के लाभ, पात्रता, दस्तावेज़ और आवेदन जानकारी देखें।`;return {title,description,alternates:{canonical:'/category/'+id},openGraph:{title,description,url:'/category/'+id,type:'website',locale:'hi_IN'}};}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!categories.some(c=>c.id===id))notFound();return <Directory schemes={(await allSchemes()).map(summarizeScheme)} initialCategory={id}/>;}
