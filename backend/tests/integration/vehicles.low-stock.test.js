const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

describe('GET /api/vehicles/low-stock', () => {
  let token;
  let vehicleId;

  beforeAll(async () => {
    const hash = await require('bcrypt').hash('User123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') ON CONFLICT (email) DO NOTHING",
      ['LowStock User', 'lowstock-user@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'lowstock-user@test.com', password: 'User123' });
    token = res.body.token;

    await pool.query("DELETE FROM vehicles");
    await pool.query("DELETE FROM settings WHERE key = 'low_stock_threshold'");

    const low = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 2) RETURNING id"
    );
    vehicleId = low.rows[0].id;
    await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Honda', 'Civic', 'Sedan', 22000, 10) RETURNING id"
    );
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('low_stock_threshold', '5')"
    );
  });

  afterAll(async () => {
    await pool.query("DELETE FROM vehicles");
    await pool.query("DELETE FROM users WHERE email = $1", ['lowstock-user@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/vehicles/low-stock');
    expect(res.status).toBe(401);
  });

  it('returns only vehicles with quantity at or below the threshold', async () => {
    const res = await request(app)
      .get('/api/vehicles/low-stock')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.threshold).toBe(5);
    expect(res.body.vehicles[0].id).toBe(vehicleId);
    expect(res.body.vehicles[0].low_stock).toBe(true);
  });

  it('is empty when all vehicles are above the threshold', async () => {
    await pool.query('UPDATE vehicles SET quantity = 20 WHERE id = $1', [vehicleId]);
    const res = await request(app)
      .get('/api/vehicles/low-stock')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.vehicles).toHaveLength(0);
  });
});