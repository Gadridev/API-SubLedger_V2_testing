import Subscription from "../model/Subscription.js";
import User from "../model/User.js";
import { deleteUserService, getAllUsersService, getUserByIdService, updateUserService } from "../services/userService.js";
import AppError from "../utils/AppError.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await getAllUsersService();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}
export async function getUserById(req, res, next) {
  try {
    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await deleteUserService(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};
export const updateUser = async (req, res, next) => {
  try {
    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser=await updateUserService(req.user._id, filteredBody);
   

    updatedUser.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export async function getCurrentUser(req, res, next) {
  try {
    const user = await req.user;
    const subscriptions = await Subscription.find({ user: user._id });

    res.status(200).json({
      status: "success",
      message: "Current user retrieved successfully",
      data: user,
      subscriptions
    });
  } catch (err) {
    next(err);
  }
}
