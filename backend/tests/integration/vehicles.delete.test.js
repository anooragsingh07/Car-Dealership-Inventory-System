const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('DELETE /api/vehicles/:id', () => {
  let adminToken;
  let userToken;
  let vehicleId;

  beforeAll(async () => {
    const adminHash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') ON CONFLICT (email) DO NOTHING",
      ['delete-admin@test.com', adminHash]
    );

    const userHash = await bcrypt.hash('User123', 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'user') ON CONFLICT (email) DO NOTHING",
      ['delete-user@test.com', userHash]
    );

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'delete-admin@test.com', password: 'Admin123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'delete-user@test.com', password: 'User123' });
    userToken = userRes.body.token;

    await pool.query("DELETE FROM vehicles");
    const ins = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 3) RETURNING id"
    );
    vehicleId = ins.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['delete-%@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).delete(`/api/vehicles/${vehicleId}`);
    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-admin user', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app)
      .delete('/api/vehicles/99999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it('returns 200 when admin deletes an existing vehicle', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');

    const check = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
    expect(check.rows).toHaveLength(0);
  });
});
