import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { getNewsDraft } from '@/lib/admin-news';
import SamacharEditor from '@/components/admin/SamacharEditor';
import { notFound } from 'next/navigation';
import type { WorkflowState } from '@/lib/admin-policy';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){const user=await requirePermission();const {slug}=await params;if(slug==='new')return <SamacharEditor role={user.role}/>;const draft=await getNewsDraft(slug);if(!draft)notFound();return <SamacharEditor initialData={draft.data} version={draft.version} workflow={draft.workflow as WorkflowState} role={user.role} published={draft.published}/>;}


