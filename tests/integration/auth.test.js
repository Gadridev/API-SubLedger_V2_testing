import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../model/User.js";


before(async () => {
  await mongoose.connect(process.env.MONGO_DB);
});

afterEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
});

describe("POST /api/v1/auth/signup", () => {

  it("should create a new user and return token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "test@test.com",
        password: "Test@1234",
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("token");
  });

  it("should fail when email already exists", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "test@test.com",
        password: "Test@1234",
      });

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "test@test.com",
        password: "Test@1234",
      });

    expect(response.status).to.equal(400);
  });

});

describe("POST /api/v1/auth/login", () => {

  it("should login successfully and return token", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "test@test.com",
        password: "Test@1234",
      });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@test.com",
        password: "Test@1234",
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
  });

  it("should fail with wrong password", async () => {
    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "TestUser",
        email: "test@test.com",
        password: "Test@1234",
      });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@test.com",
        password: "wrongpassword",
      });

    expect(response.status).to.equal(401);
  });

});