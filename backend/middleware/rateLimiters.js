import {
  rateLimit,
} from "express-rate-limit";

/*
  General API protection
*/

export const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 300,

    standardHeaders:
      "draft-8",

    legacyHeaders: false,

    message: {
      success: false,

      message:
        "Too many requests. Please try again later.",
    },
  });

/*
  Login / registration protection
*/

export const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 10,

    standardHeaders:
      "draft-8",

    legacyHeaders: false,

    skipSuccessfulRequests:
      true,

    message: {
      success: false,

      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

/*
  SOS endpoint protection.

  Keep this relatively permissive:
  an emergency endpoint should not
  be blocked by an overly aggressive
  limiter.

  Duplicate active alerts are also
  prevented at the application layer.
*/

export const sosLimiter =
  rateLimit({
    windowMs:
      60 * 1000,

    limit: 10,

    standardHeaders:
      "draft-8",

    legacyHeaders: false,

    message: {
      success: false,

      message:
        "Too many SOS requests. Please wait briefly and try again.",
    },
  });