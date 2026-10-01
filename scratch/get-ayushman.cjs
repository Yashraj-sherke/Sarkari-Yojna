const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);
sql`SELECT data FROM schemes WHERE slug = 'ayushman-bharat'`.then(res => console.log(JSON.stringify(res[0].data, null, 2))).catch(console.error);
