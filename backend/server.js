import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

/* ---------------- CONFIG ---------------- */

import connectDB from "./config/db.js";
import validateEnv from "./config/validateEnv.js";

/* ---------------- ROUTES ---------------- */

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import acknowledgementRoutes from "./routes/acknowledgementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

/* ---------------- SECURITY ---------------- */

import {
  helmetMiddleware,
  corsMiddleware,
  hppMiddleware,
} from "./middleware/securityMiddleware.js";

import {
  apiLimiter,
} from "./middleware/rateLimiters.js";

import sanitizeMiddleware from "./middleware/sanitizeMiddleware.js";

/* ---------------- ERROR HANDLING ---------------- */

import notFound from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

/* ========================================
   ENVIRONMENT
======================================== */

validateEnv();

/* ========================================
   APP
======================================== */

const app = express();

const PORT =
  process.env.PORT || 5000;

/*
  IMPORTANT FOR RENDER

  Render sits behind a reverse proxy
  and forwards the original client IP
  using X-Forwarded-For.

  This allows Express and
  express-rate-limit to correctly
  identify the client IP.
*/

app.set("trust proxy", 1);

app.disable("x-powered-by");

/* ========================================
   SECURITY
======================================== */

app.use(helmetMiddleware);

app.use(corsMiddleware);

/* ========================================
   BODY PARSERS
======================================== */

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  })
);

/* ========================================
   COOKIE PARSER
======================================== */

app.use(cookieParser());

/* ========================================
   REQUEST SANITIZATION
======================================== */

app.use(sanitizeMiddleware);

app.use(hppMiddleware);

/* ========================================
   LOGGING
======================================== */

if (
  process.env.NODE_ENV ===
  "development"
) {
  app.use(morgan("dev"));
}

/* ========================================
   RATE LIMITING
======================================== */

app.use(
  "/api",
  apiLimiter
);

/* ========================================
   HEALTH CHECK
======================================== */

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,

      status: "healthy",

      service:
        "Silent SOS API",

      environment:
        process.env.NODE_ENV ||
        "development",

      timestamp:
        new Date().toISOString(),
    });
  }
);

/* ========================================
   API ROUTES
======================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/emergency-contacts",
  contactRoutes
);

app.use(
  "/api/alerts",
  alertRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/acknowledgements",
  acknowledgementRoutes
);

/* ========================================
   404
======================================== */

app.use(notFound);

/* ========================================
   GLOBAL ERROR HANDLER
======================================== */

app.use(errorHandler);

/* ========================================
   START SERVER
======================================== */

const startServer = async () => {
  try {
    /*
      IMPORTANT:
      Connect MongoDB BEFORE accepting
      HTTP requests.
    */

    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `Silent SOS API running on port ${PORT} in ${
            process.env.NODE_ENV ||
            "development"
          } mode`
        );
      }
    );

  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();