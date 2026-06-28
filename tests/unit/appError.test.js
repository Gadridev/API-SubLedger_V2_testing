import { expect } from "chai";
import AppError from "../../utils/AppError.js";

describe("AppError", () => {

  it("should store the message correctly", () => {
    const error = new AppError("Not found", 404);
    expect(error.message).to.equal("Not found");
  });

  it("should store the statusCode correctly", () => {
    const error = new AppError("Not found", 404);
    expect(error.statusCode).to.equal(404);
  });

  it("should set status to fail for 4xx errors", () => {
    const error = new AppError("Not found", 404);
    expect(error.status).to.equal("fail");
  });

  it("should set status to error for 5xx errors", () => {
    const error = new AppError("Server error", 500);
    expect(error.status).to.equal("error");
  });

  it("should be an instance of Error", () => {
    const error = new AppError("Not found", 404);
    expect(error).to.be.instanceOf(Error);
  });

});