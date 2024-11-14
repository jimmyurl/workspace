import request from 'supertest';
import app from '../app.js';  // Assuming your Express app is exported from app.js

describe('API Tests', () => {
  test('GET / returns 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});