import express from "express";
import { login, signup } from "../controller/AuthController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginUserSchema,
  userCreateSchema,
} from "../validation/schema/userSchema.js";

const router = express.Router();
router.post("/signup", validateRequest(userCreateSchema), signup);
router.post("/login", validateRequest(loginUserSchema), login);

export default router;