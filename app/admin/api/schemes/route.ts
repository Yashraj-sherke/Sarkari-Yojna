import { z } from 'zod';
import { checkOrigin, readBody, failure, json } from '@/lib/server';
import { saveDraft } from '@/lib/admin-cms';
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const body = z.object({ scheme: z.unknown(), note: z.string().trim().min(5).max(2000), version: z.number().int().min(0), oldSlug: z.string().max(100).optional() }).strict().parse(await readBody(req));
    return json(await saveDraft(body.scheme, body.note, body.version, body.oldSlug));
  } catch(error) { return failure(error); }
}
