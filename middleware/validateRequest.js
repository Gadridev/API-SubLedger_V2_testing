import { StatusCodes } from "http-status-codes";

export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
      errors: {
        wrap: {
          label: false, // Don't wrap error labels
        },
      },
    });

    if (!error) {
      req[property] = value;
      return next();
    }

    // Format errors for consistent API responses
    const errorDetails = error.details.map((detail) => ({
      path: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: "error",
      message: "Validation error",
      errors: errorDetails,
    });
  };
};
