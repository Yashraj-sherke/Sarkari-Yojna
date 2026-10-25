import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { ImportCenter } from '@/components/admin/ImportCenter';
export default async function Page(){await requirePermission('edit');return <ImportCenter/>;}

