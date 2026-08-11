import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  authLimiter,
} from "../middleware/rateLimiters.js";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
    resetPassword,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validateRequest,
} from "../middleware/validators/authValidator.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validateRequest,
  registerUser
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  validateRequest,
  loginUser
);

router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  validateRequest,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  authLimiter,
  resetPasswordValidation,
  validateRequest,
  resetPassword
);
router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/logout",
  logoutUser
);

export default router;