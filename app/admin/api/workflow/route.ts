import { z } from 'zod';
import { checkOrigin, readBody, json, failure } from '@/lib/server';
import { actions } from '@/lib/admin-policy';
import { transition } from '@/lib/admin-cms';
export async function POST(req: Request) {
  try {checkOrigin(req); const body=z.object({slug:z.string().max(100),version:z.number().int().positive(),action:z.enum(actions),evidence:z.unknown().optional(),note:z.string().trim().min(5).max(2000)}).strict().parse(await readBody(req));
    return json(await transition(body.slug,body.version,body.action,body.evidence,body.note));
  } catch(error) {return failure(error);}
}
