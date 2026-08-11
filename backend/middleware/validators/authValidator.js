import {
  body,
  validationResult,
} from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 80 })
    .withMessage(
      "Name must be between 2 and 80 characters."
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage(
      "Please enter a valid email address."
    )
    .normalizeEmail(),

  body("phone")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please enter a valid 10-digit Indian mobile number."
    ),

  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "Password must contain at least 8 characters."
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain an uppercase letter."
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain a lowercase letter."
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain a number."
    ),
];

export const validateRequest = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage(
      "Please enter a valid email address."
    )
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

/* =========================================
   FORGOT PASSWORD VALIDATION
========================================= */

export const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required."
    )
    .isEmail()
    .withMessage(
      "Please enter a valid email address."
    )
    .normalizeEmail(),
];


/* =========================================
   RESET PASSWORD VALIDATION
========================================= */

export const resetPasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage(
      "New password is required."
    )
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      "Password must be between 8 and 128 characters."
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain an uppercase letter."
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain a lowercase letter."
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain a number."
    ),
];