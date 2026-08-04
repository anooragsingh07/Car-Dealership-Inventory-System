const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('Settings low-stock threshold', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    const userHash = await bcrypt.hash('User123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') ON CONFLICT (email) DO NOTHING",
      ['Settings User', 'settings-user@test.com', userHash]
    );

    const adminHash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') ON CONFLICT (email) DO NOTHING",
      ['Settings Admin', 'settings-admin@test.com', adminHash]
    );

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'settings-user@test.com', password: 'User123' });
    userToken = userRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'settings-admin@test.com', password: 'Admin123' });
    adminToken = adminRes.body.token;

    await pool.query("DELETE FROM settings WHERE key = 'low_stock_threshold'");
    await pool.query("INSERT INTO settings (key, value) VALUES ('low_stock_threshold', '5')");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM settings WHERE key = 'low_stock_threshold'");
    await pool.query("INSERT INTO settings (key, value) VALUES ('low_stock_threshold', '5')");
    await pool.query("DELETE FROM users WHERE email LIKE $1", ['settings-%@test.com']);
    await pool.end();
  });

  it('GET returns 401 without a token', async () => {
    const res = await request(app).get('/api/settings/low-stock-threshold');
    expect(res.status).toBe(401);
  });

  it('GET returns the current threshold for any authenticated user', async () => {
    const res = await request(app)
      .get('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.threshold).toBe(5);
  });

  it('PUT returns 403 for a non-admin user', async () => {
    const res = await request(app)
      .put('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ threshold: 3 });
    expect(res.status).toBe(403);
  });

  it('PUT returns 400 for an invalid threshold', async () => {
    const res = await request(app)
      .put('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ threshold: 0 });
    expect(res.status).toBe(400);
  });

  it('PUT returns 400 when threshold is missing', async () => {
    const res = await request(app)
      .put('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('PUT updates the threshold and it persists', async () => {
    const res = await request(app)
      .put('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ threshold: 3 });
    expect(res.status).toBe(200);
    expect(res.body.threshold).toBe(3);

    const get = await request(app)
      .get('/api/settings/low-stock-threshold')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(get.body.threshold).toBe(3);
  });
});