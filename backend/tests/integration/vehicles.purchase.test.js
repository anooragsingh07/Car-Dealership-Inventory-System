const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('POST /api/vehicles/:id/purchase', () => {
  let token;
  let vehicleId;
  let soldOutId;

  beforeAll(async () => {
    const hash = await bcrypt.hash('User123', 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'user') ON CONFLICT (email) DO NOTHING",
      ['purchase-test@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'purchase-test@test.com', password: 'User123' });
    token = res.body.token;

    await pool.query("DELETE FROM vehicles");
    const ins1 = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 3) RETURNING id"
    );
    vehicleId = ins1.rows[0].id;

    const ins2 = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Honda', 'Civic', 'Sedan', 22000, 0) RETURNING id"
    );
    soldOutId = ins2.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM users WHERE email = $1', ['purchase-test@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app)
      .post('/api/vehicles/99999/purchase')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('returns 409 when quantity is already 0', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${soldOutId}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(409);
  });

  it('returns 200 and decrements quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(2);
  });
});
