import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { UserManager } from '@/components/admin/UserManager';
export default async function Page(){await requirePermission('users');return <UserManager/>;}

