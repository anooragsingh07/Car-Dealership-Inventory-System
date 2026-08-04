const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('PUT /api/vehicles/:id', () => {
  let token;
  let vehicleId;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') ON CONFLICT (email) DO NOTHING",
      ['Update Test', 'update-test@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'update-test@test.com', password: 'Admin123' });
    token = res.body.token;

    await pool.query("DELETE FROM vehicles");
    const ins = await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES ('Toyota', 'Camry', 'Sedan', 25000, 3) RETURNING id"
    );
    vehicleId = ins.rows[0].id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM users WHERE email = $1', ['update-test@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).put(`/api/vehicles/${vehicleId}`).send({ price: 26000 });
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid data', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: -100 });
    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app)
      .put('/api/vehicles/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 26000 });
    expect(res.status).toBe(404);
  });

  it('returns 200 with updated vehicle', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 26000, quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body.vehicle.make).toBe('Honda');
    expect(res.body.vehicle.model).toBe('Accord');
    expect(Number(res.body.vehicle.price)).toBe(26000);
    expect(res.body.vehicle.quantity).toBe(5);
  });
});
