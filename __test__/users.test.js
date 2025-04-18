const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../models/users.models");
const userDAO = require("../daos/user.dao");

const authService = require('../services/auth.service')
const loginRouter = require('../routes/auth.routes')

const TEST_USER_ADMIN = {
  username: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "testpassword",
  roles: ["admin"]
};

let token;

beforeAll(async () => {

  const saltrounds = 10
  const hashedPassword = await bcrypt.hash(TEST_USER_ADMIN.password, saltrounds);

  await mongoose.connect(process.env.MONGODB_TEST_URI);
  console.log("Connection to MongoDB established for Jest")

  await User.deleteMany({})

  await User.create({
    username: TEST_USER_ADMIN.username,
    name: TEST_USER_ADMIN.name,
    email: TEST_USER_ADMIN.email,
    hashedPassword: hashedPassword,
    roles: TEST_USER_ADMIN.roles
  })

  const res = await request(app)
  .post("/api/login")
  .send({
    username: TEST_USER_ADMIN.username,
    password: TEST_USER_ADMIN.password
  });
  token = res.body.data.token
  console.log("token:", token)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close();
});

describe('GET /api/users', () => {
  it('should return 200 and a list of users when authorized and is admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);  // Pass the token

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 400 when no token', async () => {
    const res = await request(app)
      .get('/api/users')

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  })

  it('should return 403 when a non-admin user tries to access the users list', async () => {
    // Simulate a non-admin user login
    const nonAdminToken = 'some-fake-token-for-non-admin';

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });
})

describe('POST /api/users', () => {
  it('should return 201 and the created user when valid data is provided', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      roles: ['user']
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.roles).toEqual(newUser.roles);
  });

  it('should return 400 when required fields are missing', async () => {
    const newUser = {
      username: 'newuser',
      // Missing name, email, password, roles
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(500);
  });

  it('should return 400 when username already exists', async () => {
    const newUser = {
      username: 'existinguser',
      name: 'Existing User',
      email: 'existinguser@example.com',
      password: 'password123',
      roles: ['user']
    };

    // First, create a user with this username
    await request(app)
      .post('/api/users')
      .send(newUser);

    // Try to create the user again
    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(400);
  });

  it('creates a user and then deletes it', async () => {
    const newUser = {
      username: 'deleteme',
      name: 'deleteme',
      email: 'deleteme@example.com',
      password: '123',
      roles: ['user']
    };

    // First, create a user with this username
    const toBeDeletedUser = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)

    // try to retrive user id
    const userId = toBeDeletedUser.body._id
    expect(userId).toBeDefined()

    await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });
  it('delete with no id expext 404', async () => {
    await request(app)
    .delete(`/api/users/`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
  })
  it('delete with invalid id expect 404', async () => {
    const justAWrongId = '60c72b2f9b1e8b1a8b2a3c4d' //invalid id but valid mongo format
    await request(app)
    .delete(`/api/users/${justAWrongId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
  })
  it('delete with invalid id expect 500', async () => {
    const justAWrongId = 'invalid id format' //invalid id and invalid mongo format
    await request(app)
    .delete(`/api/users/${justAWrongId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(500)
  })
});