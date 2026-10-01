import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveScheme } from '@/lib/server';
import { getAdminUser } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as any;
    
    // Convert boolean flags if they come as strings
    if (typeof body.priority === 'string') body.priority = body.priority === 'true';
    if (typeof body.isSample === 'string') body.isSample = body.isSample === 'true';

    // Make sure arrays exist
    if (!body.rules) body.rules = [];
    if (!body.documents) body.documents = [];
    if (!body.steps) body.steps = [];

    const editorialNote = body.editorialNote || 'Updated via Admin CMS';
    delete body.editorialNote; // Remove from schema payload

    const result = await saveScheme(body, user.email, editorialNote);
    
    // Purge Next.js cache for the public site to show updates immediately
    revalidatePath('/');
    revalidatePath('/yojna/[slug]', 'page');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/state/[slug]', 'page');

    return NextResponse.json({ success: true, scheme: result });
  } catch (error: any) {
    console.error('Save Scheme Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save scheme' }, { status: 400 });
  }
}
