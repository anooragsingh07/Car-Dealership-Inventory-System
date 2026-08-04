const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('GET /api/vehicles', () => {
  let token;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') ON CONFLICT (email) DO NOTHING",
      ['List Test', 'list-test@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'list-test@test.com', password: 'Admin123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['list-test@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
  });

  it('returns an empty array when no vehicles exist', async () => {
    await pool.query('DELETE FROM vehicles');
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.vehicles)).toBe(true);
    expect(res.body.vehicles).toHaveLength(0);
  });

  it('returns an array of vehicles', async () => {
    await pool.query("DELETE FROM vehicles");
    await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 3)"
    );
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.vehicles)).toBe(true);
    expect(res.body.vehicles.length).toBeGreaterThanOrEqual(1);
    expect(res.body.vehicles[0]).toHaveProperty('make');
  });
});
