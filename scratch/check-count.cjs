const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);
sql`SELECT count(*) FROM schemes WHERE data::jsonb->>'status' = 'ACTIVE'`.then(res => console.log("TOTAL: " + res[0].count)).catch(console.error);
