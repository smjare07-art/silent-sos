import {
  body,
  param,
  validationResult,
} from "express-validator";

export const createAlertValidation = [
  body("latitude")
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Invalid latitude."),

  body("longitude")
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Invalid longitude."),

  body("accuracy")
    .optional({
      nullable: true,
    })
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Accuracy must be a positive number."
    ),

  body("timestamp")
    .optional()
    .isISO8601()
    .withMessage(
      "Invalid location timestamp."
    ),
];

export const locationUpdateValidation = [
  ...createAlertValidation,
];

export const alertIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid alert ID."),
];

export const validateAlertRequest = (
  req,
  res,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",

      errors: errors.array().map(
        (error) => ({
          field: error.path,
          message: error.msg,
        })
      ),
    });
  }

  next();
};