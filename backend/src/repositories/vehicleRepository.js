const pool = require('../config/db');

async function create({ make, model, category, price, quantity }) {
  const { rows } = await pool.query(
    `INSERT INTO vehicles (make, model, category, price, quantity)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [make, model, category, price, quantity]
  );
  return rows[0];
}

module.exports = { create };
