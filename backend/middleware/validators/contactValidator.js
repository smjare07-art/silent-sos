import {
  body,
  param,
  validationResult,
} from "express-validator";

export const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Contact name is required.")
    .isLength({ min: 2, max: 80 })
    .withMessage(
      "Contact name must be between 2 and 80 characters."
    ),

  body("relationship")
    .trim()
    .notEmpty()
    .withMessage("Relationship is required.")
    .isLength({ max: 50 })
    .withMessage(
      "Relationship cannot exceed 50 characters."
    ),

  body("phone")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Enter a valid 10-digit Indian mobile number."
    ),

  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),

  body("isPrimary")
    .optional()
    .isBoolean()
    .withMessage(
      "isPrimary must be true or false."
    ),
];

export const contactIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid contact ID."),
];

export const validateContactRequest = (
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