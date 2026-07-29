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

async function findAll() {
  const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return rows[0] || null;
}

async function search({ make, model, category, minPrice, maxPrice }) {
  const conditions = [];
  const values = [];

  if (make)     { values.push(`%${make}%`);   conditions.push(`make ILIKE $${values.length}`); }
  if (model)    { values.push(`%${model}%`);  conditions.push(`model ILIKE $${values.length}`); }
  if (category) { values.push(category);      conditions.push(`category = $${values.length}`); }
  if (minPrice) { values.push(minPrice);       conditions.push(`price >= $${values.length}`); }
  if (maxPrice) { values.push(maxPrice);       conditions.push(`price <= $${values.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`SELECT * FROM vehicles ${where} ORDER BY id`, values);
  return rows;
}

async function update(id, fields) {
  const setClauses = [];
  const values = [];
  const allowedFields = ['make', 'model', 'category', 'price', 'quantity'];

  for (const field of allowedFields) {
    if (fields[field] !== undefined) {
      values.push(fields[field]);
      setClauses.push(`${field} = $${values.length}`);
    }
  }

  if (setClauses.length === 0) return null;

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE vehicles SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

async function purchase(id) {
  const { rows } = await pool.query(
    'UPDATE vehicles SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *',
    [id]
  );
  return rows[0] || null;
}

async function restock(id, amount) {
  const { rows } = await pool.query(
    'UPDATE vehicles SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
    [amount, id]
  );
  return rows[0] || null;
}

module.exports = { create, findAll, findById, search, update, remove, purchase, restock };
