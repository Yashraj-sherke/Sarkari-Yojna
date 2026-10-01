require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    const rows = await sql`SELECT slug, status FROM schemes`;
    console.log(rows.length + ' schemes total in db');
    rows.forEach(r => console.log(r.slug, r.status));
  } catch (err) {
    console.error(err);
  }
}
main();
