import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getAdminOverview,
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  getAdminAlerts,
  getAdminAlertDetails,
  getAdminNotifications,
    getAdminKpis,
} from "../controllers/adminController.js";


const router = express.Router();


/*
  ========================================
  ADMIN SECURITY
  ========================================

  Every admin endpoint requires:

  1. Valid authentication
  2. Admin role
*/

router.use(protect);
router.use(adminOnly);


/*
  ========================================
  ADMIN OVERVIEW
  ========================================
*/

router.get(
  "/dashboard",
  getAdminOverview
);


/*
  ========================================
  USER MANAGEMENT
  ========================================
*/

router.get(
  "/users",
  getAdminUsers
);


router.patch(
  "/users/:id/status",
  updateUserStatus
);


router.patch(
  "/users/:id/role",
  updateUserRole
);


/*
  ========================================
  EMERGENCY ALERT MANAGEMENT
  ========================================
*/


/*
  Get all emergency alerts
*/

router.get(
  "/alerts",
  getAdminAlerts
);


/*
  Get single emergency alert
*/

router.get(
  "/alerts/:id",
  getAdminAlertDetails
);

router.get(
  "/notifications",
  getAdminNotifications
);
router.get(
  "/kpis",
  getAdminKpis
);
export default router;