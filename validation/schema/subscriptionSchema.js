import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  price: Joi.number().min(0).required(),

  billingCycle: Joi.string()
    .valid("monthly", "yearly")
    .required(),

  startDate: Joi.date().required(),


  user: Joi.string().hex().length(24),
});

export const updateSubscriptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  price: Joi.number().min(0),

  billingCycle: Joi.string()
    .valid("monthly", "yearly"),

  startDate: Joi.date(),
}).min(1);