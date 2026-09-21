import {notFound} from 'next/navigation';
import {categories} from '@/lib/domain';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
export const revalidate = 3600;
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;return {title:categories.find(c=>c.id===id)?.name??'श्रेणी',alternates:{canonical:'/category/'+id}};}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!categories.some(c=>c.id===id))notFound();return <Directory schemes={await allSchemes()} initialCategory={id}/>;}
