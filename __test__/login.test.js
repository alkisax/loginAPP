const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const User = require("../models/users.models");
const authService = require("../services/auth.service");

const TEST_USER = {
  username: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "testpassword",
  roles: ["admin"]
};

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await User.deleteMany({});

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_USER.password, saltRounds)

  await User.create({
    username: TEST_USER.username,
    name: TEST_USER.name,
    email: TEST_USER.email,
    hashedPassword: hashedPassword,
    roles: TEST_USER.roles
  })
})

afterEach(async () => {
  await mongoose.connection.close();
})

afterAll(async () => {
  await mongoose.disconnect();
})

describe("POST /api/login", () => {
  it("should return a valid token and user data when credentials are correct", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_USER.username,
        password: TEST_USER.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user).toMatchObject({
      username: TEST_USER.username,
      email: TEST_USER.email,
      roles: TEST_USER.roles
    });
  });
});