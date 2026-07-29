const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('POST /api/vehicles/:id/restock', () => {
  let adminToken;
  let userToken;
  let vehicleId;

  beforeAll(async () => {
    const adminHash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') ON CONFLICT (email) DO NOTHING",
      ['restock-admin@test.com', adminHash]
    );

    const userHash = await bcrypt.hash('User123', 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'user') ON CONFLICT (email) DO NOTHING",
      ['restock-user@test.com', userHash]
    );

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'restock-admin@test.com', password: 'Admin123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'restock-user@test.com', password: 'User123' });
    userToken = userRes.body.token;

    await pool.query("DELETE FROM vehicles");
    const ins = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 3) RETURNING id"
    );
    vehicleId = ins.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['restock-%@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .send({ amount: 5 });
    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-admin user', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 });
    expect(res.status).toBe(403);
  });

  it('returns 400 when amount is missing', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is negative', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: -1 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when amount is zero', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 0 });
    expect(res.status).toBe(400);
  });

  it('returns 200 and increments quantity when admin restocks', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(8);
  });
});
