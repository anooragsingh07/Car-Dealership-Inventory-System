const pool = require('../config/db');

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function emailExists(email) {
  const { rows } = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  return rows.length > 0;
}

async function createUser({ name, email, passwordHash, role }) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
    [name, email, passwordHash, role]
  );
  return rows[0];
}

module.exports = { findByEmail, emailExists, createUser };
