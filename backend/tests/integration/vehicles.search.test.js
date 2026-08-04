const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/db');
const bcrypt = require('bcrypt');

describe('GET /api/vehicles/search', () => {
  let token;

  beforeAll(async () => {
    const hash = await bcrypt.hash('Admin123', 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') ON CONFLICT (email) DO NOTHING",
      ['Search Test', 'search-test@test.com', hash]
    );
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'search-test@test.com', password: 'Admin123' });
    token = res.body.token;

    await pool.query("DELETE FROM vehicles");
    await pool.query(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES " +
      "('Toyota', 'Camry', 'Sedan', 25000, 3)," +
      "('Honda', 'Civic', 'Sedan', 22000, 5)," +
      "('Ford', 'Explorer', 'SUV', 35000, 2)," +
      "('Tesla', 'Model 3', 'Sedan', 45000, 1)"
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM vehicles');
    await pool.query('DELETE FROM users WHERE email = $1', ['search-test@test.com']);
    await pool.end();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/vehicles/search');
    expect(res.status).toBe(401);
  });

  it('filters by make', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
    expect(res.body.vehicles[0].make).toBe('Toyota');
  });

  it('filters by model (ILIKE)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?model=civic')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
    expect(res.body.vehicles[0].model).toBe('Civic');
  });

  it('filters by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
    expect(res.body.vehicles[0].category).toBe('SUV');
  });

  it('filters by minPrice', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=30000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles.length).toBeGreaterThanOrEqual(2);
    res.body.vehicles.forEach(v => expect(Number(v.price)).toBeGreaterThanOrEqual(30000));
  });

  it('filters by maxPrice', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?maxPrice=23000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
    expect(res.body.vehicles[0].make).toBe('Honda');
  });

  it('combines multiple filters', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=Sedan&minPrice=24000&maxPrice=46000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toHaveLength(2);
  });

  it('returns empty array when no matches', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=NonExistent')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });
});
