import { getDraft } from '@/lib/admin-cms';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { SchemeEditor } from '@/components/admin/SchemeEditor';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function EditScheme({params}:{params:Promise<{slug:string}>}) {
  const user=await requirePermission(); const {slug}=await params; const draft=await getDraft(slug); if(!draft)notFound();
  return <div><h1 className="text-2xl font-bold mb-5">योजना संपादन: {draft.data.title}</h1><SchemeEditor initialData={draft.data} slug={slug} version={draft.version} workflow={draft.workflow} role={user.role} published={draft.published}/></div>;
}


