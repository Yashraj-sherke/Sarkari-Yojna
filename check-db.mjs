import { neon } from '@neondatabase/serverless';

async function check() {
  const dbUrl = "postgresql://neondb_owner:npg_XeVR7iYLJn5M@ep-morning-bread-b3n8oteg.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
  try {
    const sql = neon(dbUrl);
    const results = await sql`SELECT slug, title FROM samachar`;
    console.log("Articles in DB:", results);
  } catch (err) {
    console.error("DB error:", err);
  }
}
check();
