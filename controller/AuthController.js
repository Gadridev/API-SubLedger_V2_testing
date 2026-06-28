import { signupUserService, loginUserService } from "../services/authService.js";

export async function signup(req, res, next) {
  try {
    const { user, token } = await signupUserService(req.body);
    user.password = undefined;
    res.status(201).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUserService(email, password);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
