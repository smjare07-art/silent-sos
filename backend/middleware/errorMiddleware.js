const errorHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode =
    error.statusCode ||
    error.status ||
    500;

  let message =
    error.message ||
    "Internal server error.";

  /*
    Mongoose invalid ObjectId
  */

  if (
    error.name ===
    "CastError"
  ) {
    statusCode = 400;

    message =
      "Invalid resource identifier.";
  }

  /*
    Mongo duplicate key
  */

  if (error.code === 11000) {
    statusCode = 409;

    message =
      "A resource with this value already exists.";
  }

  /*
    Mongoose validation
  */

  if (
    error.name ===
    "ValidationError"
  ) {
    statusCode = 422;

    message =
      Object.values(
        error.errors
      )
        .map(
          (item) =>
            item.message
        )
        .join(" ");
  }

  /*
    JWT errors
  */

  if (
    error.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;

    message =
      "Invalid authentication token.";
  }

  if (
    error.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;

    message =
      "Authentication token has expired.";
  }

  const response = {
    success: false,
    message,
  };

  /*
    Never expose stack trace
    in production.
  */

  if (
    process.env.NODE_ENV !==
    "production"
  ) {
    response.stack =
      error.stack;
  }

  res
    .status(statusCode)
    .json(response);
};

export default errorHandler;