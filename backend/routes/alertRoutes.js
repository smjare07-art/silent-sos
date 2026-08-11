import express from "express";
import {
  sosLimiter,
} from "../middleware/rateLimiters.js";
import protect from "../middleware/authMiddleware.js";

import {
  createAlert,
  getActiveAlert,
  updateAlertLocation,
  resolveAlert,
  cancelAlert,
  getAlertHistory,
  getAlertNotifications,
} from "../controllers/alertController.js";

import {
  createAlertValidation,
  locationUpdateValidation,
  alertIdValidation,
  validateAlertRequest,
} from "../middleware/validators/alertValidator.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  sosLimiter,
  createAlertValidation,
  validateAlertRequest,
  createAlert
);

router.get(
  "/active",
  getActiveAlert
);

router.get(
  "/history",
  getAlertHistory
);
router.get(
  "/:id/notifications",
  alertIdValidation,
  validateAlertRequest,
  getAlertNotifications
);
router.patch(
  "/:id/location",
  alertIdValidation,
  locationUpdateValidation,
  validateAlertRequest,
  updateAlertLocation
);

router.patch(
  "/:id/resolve",
  alertIdValidation,
  validateAlertRequest,
  resolveAlert
);

router.patch(
  "/:id/cancel",
  alertIdValidation,
  validateAlertRequest,
  cancelAlert
);

export default router;