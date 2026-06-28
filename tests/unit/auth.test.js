import { expect } from "chai";
import sinon from "sinon";
import AppError from "../../utils/AppError.js";

import User from "../../model/User.js";
import bcrypt from "bcryptjs";
import { loginUserService } from "../../services/authService.js";

describe("loginUserService", () => {
    
  afterEach(() => {
    sinon.restore();
  });

  it("should throw error when email or password is missing", async () => {
    try {
      await loginUserService("", "");
      expect.fail("should have thrown an error");
    } catch (err) {
      expect(err.message).to.equal("Please provide a valid email and password");
    }
  });

  it("should throw error when user not found", async () => {
    sinon.stub(User, "findOne").returns({
      select: sinon.stub().resolves(null),
    });

    try {
      await loginUserService("test@test.com", "password123");
      expect.fail("should have thrown an error");
    } catch (err) {
      expect(err.message).to.equal("Incorrect email or password");
    }
  });

  it("should throw error when password is incorrect", async () => {
    sinon.stub(User, "findOne").returns({
      select: sinon.stub().resolves({
        email: "test@test.com",
        password: "hashed"
      }),
    });
    sinon.stub(bcrypt, "compare").resolves(false);

    try {
      await loginUserService("test@test.com", "wrongpassword");
      expect.fail("should have thrown an error");
    } catch (err) {
      expect(err.message).to.equal("Incorrect email or password");
    }
  });

});