const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');

describe('POST /api/vehicles', () => {
  let token;

  beforeAll(async () => {
    const hash = await require('bcrypt').hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') ON CONFLICT (email) DO NOTHING",
      ['Vehicle Admin', 'vehicle-admin@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'vehicle-admin@test.com', password: 'Admin123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles WHERE make = $1', ['TestMake']);
    await pool.query('DELETE FROM users WHERE email = $1', ['vehicle-admin@test.com']);
    await pool.end();
  });

  it('returns 201 with the new vehicle for valid input', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'TestMake', model: 'TestModel', category: 'SUV', price: 25000, quantity: 5 });

    expect(res.status).toBe(201);
    expect(res.body.vehicle).toHaveProperty('id');
    expect(res.body.vehicle.make).toBe('TestMake');
    expect(res.body.vehicle.model).toBe('TestModel');
    expect(res.body.vehicle.category).toBe('SUV');
    expect(Number(res.body.vehicle.price)).toBe(25000);
    expect(res.body.vehicle.quantity).toBe(5);
  });

  it('returns 400 when a required field is missing', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'TestMake', model: 'TestModel' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'TestMake', model: 'TestModel', category: 'SUV', price: -100, quantity: 5 });

    expect(res.status).toBe(400);
  });

  it('returns 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'TestMake', model: 'TestModel', category: 'SUV', price: 25000, quantity: -1 });

    expect(res.status).toBe(400);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ make: 'TestMake', model: 'TestModel', category: 'SUV', price: 25000, quantity: 5 });

    expect(res.status).toBe(401);
  });
});
