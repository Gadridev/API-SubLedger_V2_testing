import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validation/schema/subscriptionSchema.js";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  updateSubscription,
} from "../controller/SubscriptionController.js";
import { protect } from "../middleware/protectMidlleware.js";

const router = express.Router();
router.use(protect);
router.get(
  "/",
  getAllSubscriptions,
);
router.delete(
  "/:id",
  deleteSubscription,
);
router.post(
  "/",
  validateRequest(createSubscriptionSchema),
  createSubscription,
);
router.put(
  "/:id",
  validateRequest(updateSubscriptionSchema),
  updateSubscription,
);
export default router;
