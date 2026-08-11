import express from "express";

import {
  acknowledgeEmergency,
} from "../controllers/acknowledgementController.js";

const router =
  express.Router();

router.get(
  "/:token",
  acknowledgeEmergency
);

export default router;