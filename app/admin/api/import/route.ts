import { requirePermission } from '@/lib/admin-auth';
import { getDraft } from '@/lib/admin-cms';
import { failure,json } from '@/lib/server';
export async function GET(req:Request){try{await requirePermission('edit');const slug=new URL(req.url).searchParams.get('slug')??'';return json({existing:await getDraft(slug)});}catch(error){return failure(error);}}
