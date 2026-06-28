// controller/SubscriptionController.js
import {
  getAllSubscriptionsService,
  createSubscriptionService,
  getSubscriptionByIdService,
  updateSubscriptionService,
  deleteSubscriptionService,
} from "../services/subscriptionService.js";

export async function getAllSubscriptions(req, res, next) {
  try {
    const subscriptions = await getAllSubscriptionsService({
      user: req.user._id,
    });
    res.status(200).json({
      status: "success",
      results: subscriptions.length,
      data: subscriptions,
    });
  } catch (err) {
    next(err);
  }
}

export async function createSubscription(req, res, next) {
  try {
    const subscriptions = {
      name: req.body.name,
      price: req.body.price,
      billingCycle: req.body.billingCycle,
      startDate: req.body.startDate,
      user: req.user._id,
    };
    const subscription = await createSubscriptionService(subscriptions);

    res.status(201).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptionById(req, res, next) {
  try {
    const subscription = await getSubscriptionByIdService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
}
export async function updateSubscription(req, res, next) {
  try {
    const subscription = await updateSubscriptionService(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: subscription,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteSubscription(req, res, next) {
  try {
    await deleteSubscriptionService(req.params.id, req.user._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
