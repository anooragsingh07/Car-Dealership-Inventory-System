const pool = require('../config/db');

const LOW_STOCK_THRESHOLD_KEY = 'low_stock_threshold';
const DEFAULT_THRESHOLD = 5;

async function getLowStockThreshold() {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [LOW_STOCK_THRESHOLD_KEY]);
  if (rows.length === 0) return DEFAULT_THRESHOLD;
  return Number(rows[0].value);
}

async function setLowStockThreshold(value) {
  const { rows } = await pool.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
     RETURNING value`,
    [LOW_STOCK_THRESHOLD_KEY, String(value)]
  );
  return Number(rows[0].value);
}

module.exports = { getLowStockThreshold, setLowStockThreshold };
