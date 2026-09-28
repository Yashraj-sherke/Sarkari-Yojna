const { Pool } = require('pg');
require('dotenv').config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const futureDate = new Date('2099-12-31T00:00:00Z').toISOString();
    
    // Update both the column and the JSON data payload for all schemes
    const res = await pool.query(`
      UPDATE schemes 
      SET 
        status = 'ACTIVE',
        next_review_at = $1::timestamp,
        data = (data::jsonb || jsonb_build_object('nextReviewAt', $1::text, 'status', 'ACTIVE'))::text
    `, [futureDate]);
    
    console.log(`Updated ${res.rowCount} schemes to ACTIVE with nextReviewAt = 2099`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
