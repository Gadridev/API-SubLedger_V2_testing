import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../app.js";
import User from "../../model/User.js";


let token;
let userId;

before(async () => {
  await mongoose.connect(process.env.MONGO_DB);
});

afterEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
});

describe("User endpoints", () => {
  beforeEach(async () => {
    const signupResponse = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "user@test.com",
        password: "Test@1234",
      });

    token = signupResponse.body.token;
    userId = signupResponse.body.data.user._id;
  });

  it("should return the current user via GET /api/v1/users/me", async () => {
    const response = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.data).to.have.property("email", "user@test.com");
  });

  it("should update the current user via PUT /api/v1/users/updateUser", async () => {
    const response = await request(app)
      .put("/api/v1/users/updateUser")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UpdatedUser",
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.user).to.have.property("name", "UpdatedUser");
    expect(response.body.data.user).to.have.property("email", "user@test.com");
  });

  it("should reject unauthenticated access to protected user endpoints", async () => {
    const response = await request(app).get("/api/v1/users/me");
    expect(response.status).to.equal(401);
  });
});

describe("Admin user endpoints", () => {
  let adminToken;
  let normalUser;

  beforeEach(async () => {
    const adminSignup = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "AdminUser",
        email: "admin@test.com",
        password: "Test@1234",
        role: "admin",
      });

    const userSignup = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "NormalUser",
        email: "normal@test.com",
        password: "Test@1234",
      });

    normalUser = userSignup.body.data.user;

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@test.com", password: "Test@1234" });

    adminToken = loginResponse.body.token;
  });

  it("should allow an admin to list users", async () => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.results).to.equal(2);
  });

  it("should allow an admin to get a user by id", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${normalUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.property("email", "normal@test.com");
  });

  it("should allow an admin to delete a user", async () => {
    const response = await request(app)
      .delete(`/api/v1/users/${normalUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).to.equal(204);
  });
});
