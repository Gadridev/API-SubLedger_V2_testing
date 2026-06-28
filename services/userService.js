import User from "../model/User.js";
import AppError from "../utils/AppError.js";

export async function getAllUsersService(data) {
  const users = await User.find(data).select("-password");
  return users;
}

export async function createuserService(data) {
  const user = await User.create(data);
  return user;
}
export async function getUserByIdService(id) {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function updateUserService(id, data) {
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function deleteUserService(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
}