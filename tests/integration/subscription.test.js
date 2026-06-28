import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "../../app.js";
import User from "../../model/User.js";
import Subscription from "../../model/Subscription.js";

dotenv.config({ path: ".env.test" });

let token;

before(async () => {
  await mongoose.connect(process.env.MONGO_DB);
});

afterEach(async () => {
  await Subscription.deleteMany({});
  await User.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
});

describe("Subscription endpoints", () => {
  beforeEach(async () => {
    const signupResponse = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "SubUser",
        email: "subuser@test.com",
        password: "Test@1234",
      });

    token = signupResponse.body.token;
  });

  it("should create a subscription", async () => {
    const response = await request(app)
      .post("/api/v1/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Netflix",
        price: 12.99,
        billingCycle: "monthly",
        startDate: new Date().toISOString(),
      });

    expect(response.status).to.equal(201);
    expect(response.body.data).to.have.property("name", "Netflix");
    expect(response.body.data).to.have.property("price", 12.99);
  });

  it("should list subscriptions for the authenticated user", async () => {
    await request(app)
      .post("/api/v1/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Spotify",
        price: 9.99,
        billingCycle: "monthly",
        startDate: new Date().toISOString(),
      });

    const response = await request(app)
      .get("/api/v1/subscription")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.results).to.equal(1);
    expect(response.body.data[0]).to.have.property("name", "Spotify");
  });

  it("should update a subscription", async () => {
    const createResponse = await request(app)
      .post("/api/v1/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Amazon Prime",
        price: 14.99,
        billingCycle: "monthly",
        startDate: new Date().toISOString(),
      });

    const subscriptionId = createResponse.body.data._id;

    const response = await request(app)
      .put(`/api/v1/subscription/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 19.99,
      });

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.property("price", 19.99);
  });

  it("should delete a subscription", async () => {
    const createResponse = await request(app)
      .post("/api/v1/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hulu",
        price: 7.99,
        billingCycle: "monthly",
        startDate: new Date().toISOString(),
      });

    const subscriptionId = createResponse.body.data._id;

    const response = await request(app)
      .delete(`/api/v1/subscription/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(204);
  });

  it("should reject access without a token", async () => {
    const response = await request(app).get("/api/v1/subscription");
    expect(response.status).to.equal(401);
  });
});
