const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash('Password123', 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Login User', 'login@test.com', hash, 'user']
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['login@test.com']);
    await pool.end();
  });

  it('returns 200 with a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'Password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'WrongPassword' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@test.com', password: 'Password123' });

    expect(res.status).toBe(401);
  });
});
