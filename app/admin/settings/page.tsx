import { requireAdminPage as requirePermission } from '@/lib/admin-auth';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { categories,schemeSchema } from '@/lib/domain';
export default async function Page(){await requirePermission('settings');return <section className="space-y-5 max-w-4xl"><h1 className="text-2xl font-bold">सेटिंग्स</h1><SettingsForm/><section className="border rounded bg-white p-5"><h2 className="font-bold">साझा श्रेणियाँ और राज्य</h2><p>ये identifiers public website और JSON schema में साझा हैं। Arbitrary rename/delete से existing URLs नहीं बदले जाते।</p><p>{categories.map(category=>`${category.id}: ${category.name}`).join(' · ')}</p><p>{schemeSchema.innerType().shape.state.options.join(' · ')}</p></section></section>;}

