const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);
sql`SELECT slug FROM schemes WHERE data::jsonb->>'status' = 'ACTIVE'`.then(res => console.log("ACTIVE SLUGS: " + res.map(r => r.slug).join(', '))).catch(console.error);
