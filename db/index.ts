let env: Record<string, any> = {};
if (typeof process !== "undefined" && process.env) {
  env = { ...process.env };
}

try {
  // @ts-ignore
  const cf = await import(/* webpackIgnore: true */ "cloudflare:workers");
  if (cf && cf.env) {
    env = { ...env, ...cf.env };
  }
} catch {
  // Cloudflare Workers environment not available (e.g. running on Vercel / Node)
}

import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable."
    );
  }

  return drizzle(env.DB, { schema });
}
