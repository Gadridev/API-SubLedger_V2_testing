// معالجة خطأ duplicate key من MongoDB
function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already exists. Please use a different value.`;
  return { statusCode: 400, status: "fail", message };
}

function sendErrorDev(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

function ErrorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // MongoDB duplicate key error code = 11000
  if (err.code === 11000) {
    const { statusCode, status, message } = handleDuplicateKeyError(err);
    err.statusCode = statusCode;
    err.status = status;
    err.message = message;
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
}

export default ErrorMiddleware;