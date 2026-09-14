import {Saved} from '@/components/personal';
import {allSchemes} from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'सहेजी योजनाएं',robots:{index:false},alternates:{canonical:'/saved'}};
export default async function Page(){return <Saved schemes={await allSchemes()}/>;}
