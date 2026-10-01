import { SchemeEditor } from '@/components/admin/SchemeEditor';

export const metadata = { title: 'New Scheme - Admin' };

export default function NewSchemePage() {
  const defaultData = {
    slug: '',
    title: '',
    english: '',
    category: 'mahila',
    state: 'central',
    summary: '',
    benefit: '',
    department: '',
    documents: [],
    steps: [],
    rules: [],
    sourceUrl: '',
    applicationUrl: '',
    sourceNotes: '',
    status: 'DRAFT',
    priority: false,
    isSample: false,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Scheme Draft</h1>
      <SchemeEditor initialData={defaultData} slug="" />
    </div>
  );
}
