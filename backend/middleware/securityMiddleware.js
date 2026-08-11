import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";

/* ========================================
   HELMET SECURITY
======================================== */

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
});

/* ========================================
   CORS
======================================== */

export const corsMiddleware = cors({
  origin(origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,

      // Local development
      "http://localhost:5173",
      "http://127.0.0.1:5173",

      // Production - Vercel
      "https://silent-nexv0dkp3-shuabham-jares-projects.vercel.app",
    ].filter(Boolean);

    /*
      Postman / server-to-server
      requests may not have Origin.
    */

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(
      `CORS blocked origin: ${origin}`
    );

    const error = new Error(
      `Origin ${origin} is not allowed by CORS.`
    );

    error.statusCode = 403;

    return callback(error);
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
});

/* ========================================
   HTTP PARAMETER POLLUTION PROTECTION
======================================== */

export const hppMiddleware = hpp();