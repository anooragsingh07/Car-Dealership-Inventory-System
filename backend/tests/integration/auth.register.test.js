const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  });
  afterAll(async () => {
    await pool.end();
  });

  it('creates a user and returns 201 without the password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'Password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
  });

  it('returns 409 when the email is already registered', async () => {
    await request(app).post('/api/auth/register').send({ name: 'Test User', email: 'test@example.com', password: 'Password123' });
    const res = await request(app).post('/api/auth/register').send({ name: 'Test User', email: 'test@example.com', password: 'Other12345' });
    expect(res.status).toBe(409);
  });
});
