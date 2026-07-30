const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const hash = await bcrypt.hash('Admin123', 10);
  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ('Admin', $1, $2, 'admin') ON CONFLICT (email) DO UPDATE SET name = 'Admin', password_hash = $2, role = 'admin'",
    ['admin@dealership.com', hash]
  );
  const { rows } = await pool.query("SELECT id, name, email, role FROM users WHERE email = 'admin@dealership.com'");
  console.log('Admin user created:', rows[0]);
  await pool.end();
})();
