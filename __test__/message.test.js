const request = require('supertest');
const app = require('../app'); // Your Express app

describe('GET /api/message', () => {
  it('should return 200 and a welcome message', async () => {
    const res = await request(app).get('/api/message');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "Hello from the server!!"
    });
  });
});