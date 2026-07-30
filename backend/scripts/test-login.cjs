const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = 'admin@dealership.com'");
  console.log('User from DB:', JSON.stringify(rows[0], null, 2));
  if (rows[0]) {
    try {
      const match = await bcrypt.compare('Admin123', rows[0].password_hash);
      console.log('Password match:', match);
    } catch (e) {
      console.log('bcrypt error:', e.message);
    }
  }
  await pool.end();
})();
