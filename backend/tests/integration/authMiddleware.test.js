const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { requireAuth, requireAdmin } = require('../../src/middleware/authMiddleware');

describe('Auth middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get('/protected', requireAuth, (req, res) => res.json({ user: req.user }));
    app.get('/admin', requireAuth, requireAdmin, (req, res) => res.json({ user: req.user }));
  });

  it('returns 401 without Authorization header', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer garbage-token');
    expect(res.status).toBe(401);
  });

  it('returns 200 with req.user for a valid token', async () => {
    const token = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.userId).toBe(1);
  });

  it('returns 403 when a non-admin hits an admin route', async () => {
    const token = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('returns 200 when an admin hits an admin route', async () => {
    const token = jwt.sign({ userId: 2, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });
});
