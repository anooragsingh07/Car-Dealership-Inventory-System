const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
