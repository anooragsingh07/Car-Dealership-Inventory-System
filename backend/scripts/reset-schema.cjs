const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  await pool.query('DROP TABLE IF EXISTS users, vehicles CASCADE');
  console.log('Dropped tables');

  const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Recreated tables with correct schema');

  const r = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position"
  );
  console.log('users columns:', r.rows.map(c => c.column_name).join(', '));
  await pool.end();
})();
