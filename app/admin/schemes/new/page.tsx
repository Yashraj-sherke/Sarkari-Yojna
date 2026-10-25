import { SchemeEditor } from '@/components/admin/SchemeEditor';
import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { blankScheme } from '@/lib/admin-policy';
export default async function NewScheme(){const user=await requirePermission('edit');return <div><h1 className="text-2xl font-bold mb-5">नई योजना का draft</h1><SchemeEditor initialData={blankScheme} slug="" role={user.role}/></div>;}

