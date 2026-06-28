// services/subscriptionService.js
import Subscription from "../model/Subscription.js";
import AppError from "../utils/AppError.js";

export async function getAllSubscriptionsService(data) {
  const subscriptions = await Subscription.find(data);
  return subscriptions;
}

export async function createSubscriptionService(data) {
  const subscription = await Subscription.create(data);
  return subscription;
}

export async function getSubscriptionByIdService(id, userId) {
  const subscription = await Subscription.findOne({
    _id: id,
    user: userId,
  });

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  return subscription;
}

export async function updateSubscriptionService(id, userId, data) {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }

  return subscription;
}

export async function deleteSubscriptionService(id, userId) {
  const subscription = await Subscription.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!subscription) {
    throw new AppError("Subscription not found", 404);
  }
}
