const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require('jsonwebtoken');

const User = require("../models/users.models");
const userDAO = require("../daos/user.dao");

const TEST_USER = {
  username: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "testpassword",
  roles: ["admin"]
};

beforeAll(async () => {
  await User.deleteMany({});  
});

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
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Routes", () => {
  
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          username: "newuser",
          name: "New User",
          password: "newpassword",
          email: "newuser@example.com",
          roles: ["user"]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.username).toBe("newuser");
      expect(res.body.data.email).toBe("newuser@example.com");
      expect(res.body.data.roles).toEqual(["user"]);
    });

    it("should fail if username is missing", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          name: "New User",
          password: "newpassword",
          email: "newuser@example.com",
          roles: ["user"]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.error).toBe("username is required");
    });

    it("should fail if password is missing", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          username: "newuser",
          name: "New User",
          email: "newuser@example.com",
          roles: ["user"]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.error).toBe("password is required");
    });
  });

  describe("GET /api/users", () => {
    it("should retrieve all users for admin", async () => {
      const adminToken = await request(app)
        .post("/api/login")
        .send({
          username: TEST_USER.username,
          password: TEST_USER.password
        })
        .then(res => res.body.data.token);

      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should fail if the user is not an admin", async () => {
      const nonAdminUser = {
        username: "nonadminuser",
        password: "password",
        roles: ["user"]
      };

      const nonAdminToken = await request(app)
        .post("/api/login")
        .send(nonAdminUser)
        .then(res => res.body.data.token);

      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${nonAdminToken}`);

      expect(res.statusCode).toBe(403); // Forbidden
      expect(res.body.status).toBe(false);
      expect(res.body.error).toBe("Forbidden");
    });

    it("should fail if the token is invalid", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401); // Unauthorized
      expect(res.body.status).toBe(false);
      expect(res.body.error).toBe("Invalid or expired token");
    });
  });
});
