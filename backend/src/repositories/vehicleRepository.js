const pool = require('../config/db');

const THRESHOLD_EXPR = `COALESCE((SELECT s.value::int FROM settings s WHERE s.key = 'low_stock_threshold'), 5)`;
const THRESHOLD_SUBQUERY = `${THRESHOLD_EXPR} AS low_stock_threshold`;

function toVehicle(row) {
  if (!row) return null;
  const { low_stock_threshold, ...vehicle } = row;
  return { ...vehicle, low_stock: Number(vehicle.quantity) <= Number(low_stock_threshold) };
}

async function create({ make, model, category, price, quantity }) {
  const { rows } = await pool.query(
    `WITH inserted AS (
       INSERT INTO vehicles (make, model, category, price, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *
     )
     SELECT i.*, ${THRESHOLD_SUBQUERY}
     FROM inserted i`,
    [make, model, category, price, quantity]
  );
  return toVehicle(rows[0]);
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT v.*, ${THRESHOLD_SUBQUERY}
     FROM vehicles v
     ORDER BY v.id`
  );
  return rows.map(toVehicle);
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT v.*, ${THRESHOLD_SUBQUERY}
     FROM vehicles v
     WHERE v.id = $1`,
    [id]
  );
  return toVehicle(rows[0]);
}

async function findLowStock() {
  const { rows } = await pool.query(
    `SELECT v.*, ${THRESHOLD_SUBQUERY}
     FROM vehicles v
     WHERE v.quantity <= ${THRESHOLD_EXPR}
     ORDER BY v.id`
  );
  return rows.map(toVehicle);
}

async function search({ make, model, category, minPrice, maxPrice }) {
  const conditions = [];
  const values = [];

  if (make)     { values.push(`%${make}%`);   conditions.push(`v.make ILIKE $${values.length}`); }
  if (model)    { values.push(`%${model}%`);  conditions.push(`v.model ILIKE $${values.length}`); }
  if (category) { values.push(category);      conditions.push(`v.category = $${values.length}`); }
  if (minPrice) { values.push(minPrice);       conditions.push(`v.price >= $${values.length}`); }
  if (maxPrice) { values.push(maxPrice);       conditions.push(`v.price <= $${values.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT v.*, ${THRESHOLD_SUBQUERY}
     FROM vehicles v
     ${where}
     ORDER BY v.id`,
    values
  );
  return rows.map(toVehicle);
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
    `WITH updated AS (
       UPDATE vehicles SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *
     )
     SELECT u.*, ${THRESHOLD_SUBQUERY}
     FROM updated u`,
    values
  );
  return toVehicle(rows[0]);
}

async function remove(id) {
  const { rows } = await pool.query(
    `WITH deleted AS (
       DELETE FROM vehicles WHERE id = $1 RETURNING *
     )
     SELECT d.*, ${THRESHOLD_SUBQUERY}
     FROM deleted d`,
    [id]
  );
  return toVehicle(rows[0]);
}

async function purchase(id) {
  const { rows } = await pool.query(
    `WITH updated AS (
       UPDATE vehicles SET quantity = quantity - 1 WHERE id = $1 AND quantity > 0 RETURNING *
     )
     SELECT u.*, ${THRESHOLD_SUBQUERY}
     FROM updated u`,
    [id]
  );
  return toVehicle(rows[0]);
}

async function restock(id, amount) {
  const { rows } = await pool.query(
    `WITH updated AS (
       UPDATE vehicles SET quantity = quantity + $1 WHERE id = $2 RETURNING *
     )
     SELECT u.*, ${THRESHOLD_SUBQUERY}
     FROM updated u`,
    [amount, id]
  );
  return toVehicle(rows[0]);
}

module.exports = { create, findAll, findById, findLowStock, search, update, remove, purchase, restock };
