const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const cars = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 2500000, quantity: 5 },
  { make: 'Honda', model: 'CR-V', category: 'SUV', price: 3200000, quantity: 3 },
  { make: 'Ford', model: 'F-150', category: 'Truck', price: 4500000, quantity: 0 },
  { make: 'BMW', model: '3 Series', category: 'Sedan', price: 5500000, quantity: 2 },
  { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 6000000, quantity: 4 },
  { make: 'Hyundai', model: 'Creta', category: 'SUV', price: 1800000, quantity: 7 },
  { make: 'Maruti', model: 'Swift', category: 'Hatchback', price: 800000, quantity: 10 },
  { make: 'Mercedes', model: 'GLE', category: 'SUV', price: 8500000, quantity: 1 },
];

(async () => {
  await pool.query('DELETE FROM vehicles');
  for (const c of cars) {
    await pool.query(
      'INSERT INTO vehicles (make, model, category, price, quantity) VALUES ($1, $2, $3, $4, $5)',
      [c.make, c.model, c.category, c.price, c.quantity]
    );
  }
  const { rows } = await pool.query('SELECT COUNT(*)::int AS cnt FROM vehicles');
  console.log(`Seeded ${rows[0].cnt} demo cars`);
  await pool.end();
})();
