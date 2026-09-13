import {writeFileSync} from 'node:fs';
import {seeds} from '../lib/seed.ts';
const esc=(v:string)=>"'"+v.replaceAll("'","''")+"'";
writeFileSync('drizzle/0001_seed.sql',seeds.map(s=>`INSERT OR IGNORE INTO schemes (slug,data,status,next_review_at,updated_at) VALUES (${esc(s.slug)},${esc(JSON.stringify(s))},${esc(s.status)},NULL,'2026-09-13T00:00:00.000Z');`).join('\n'));
