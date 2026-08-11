const sanitizeObject = (
  value
) => {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(
      sanitizeObject
    );
  }

  const sanitized = {};

  for (
    const [key, item]
    of Object.entries(value)
  ) {
    /*
      MongoDB operators start with $
      and dotted keys can alter query
      semantics.
    */

    if (
      key.startsWith("$") ||
      key.includes(".")
    ) {
      continue;
    }

    sanitized[key] =
      sanitizeObject(item);
  }

  return sanitized;
};

const sanitizeMiddleware = (
  req,
  res,
  next
) => {
  if (req.body) {
    req.body =
      sanitizeObject(
        req.body
      );
  }

  next();
};

export default sanitizeMiddleware;