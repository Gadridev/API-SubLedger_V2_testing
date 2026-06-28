import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/User.js";
import AppError from "../utils/AppError.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

export async function signupUserService({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });
  const token = signToken(user._id);
  return { user, token };
}

export async function loginUserService(email, password) {
  if (!email || !password) {
    throw new AppError("Please provide a valid email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = signToken(user._id);
  return { user, token };
}
