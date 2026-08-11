import mongoose from "mongoose";

const notificationLogSchema =
  new mongoose.Schema(
    {
      /* ========================================
         ALERT
      ======================================== */

      alert: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Alert",

        required: true,

        index: true,
      },

      /* ========================================
         USER
      ======================================== */

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      /* ========================================
         EMERGENCY CONTACT
      ======================================== */

      contact: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "EmergencyContact",

        default: null,
      },

      /* ========================================
         RECIPIENT
      ======================================== */

      recipientName: {
        type: String,

        required: true,

        trim: true,
      },

      recipient: {
        type: String,

        required: true,

        trim: true,
      },

      /* ========================================
         NOTIFICATION CHANNEL
      ======================================== */

      channel: {
        type: String,

        enum: [
          "EMAIL",
          "SMS",
        ],

        required: true,
      },

      /* ========================================
         DELIVERY STATUS
      ======================================== */

      status: {
        type: String,

        enum: [
          "PENDING",
          "SENT",
          "FAILED",
          "SKIPPED",
        ],

        default: "PENDING",

        index: true,
      },

      /* ========================================
         PROVIDER MESSAGE ID
      ======================================== */

      providerMessageId: {
        type: String,

        default: null,
      },

      /* ========================================
         FAILURE INFORMATION
      ======================================== */

      failureReason: {
        type: String,

        default: null,
      },

      /* ========================================
         SENT TIME
      ======================================== */

      sentAt: {
        type: Date,

        default: null,
      },

      /* ========================================
         ACKNOWLEDGEMENT TOKEN
         
         IMPORTANT:
         index: true is NOT used here
         because schema.index() is defined below.
      ======================================== */

      acknowledgementToken: {
        type: String,

        default: null,

        select: false,
      },

      /* ========================================
         ACKNOWLEDGEMENT STATUS
      ======================================== */

      acknowledgementStatus: {
        type: String,

        enum: [
          "PENDING",
          "ACKNOWLEDGED",
        ],

        default: "PENDING",

        index: true,
      },

      /* ========================================
         ACKNOWLEDGED TIME
      ======================================== */

      acknowledgedAt: {
        type: Date,

        default: null,
      },

      /* ========================================
         ACKNOWLEDGED BY
      ======================================== */

      acknowledgedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "EmergencyContact",

        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

/* ========================================
   INDEXES
======================================== */

/*
  Alert notification lookup
*/

notificationLogSchema.index({
  alert: 1,
  createdAt: -1,
});

/*
  Contact acknowledgement lookup
*/

notificationLogSchema.index({
  alert: 1,
  contact: 1,
});

/*
  Secure acknowledgement token lookup

  This is the ONLY index definition
  for acknowledgementToken.
*/

notificationLogSchema.index({
  acknowledgementToken: 1,
});

/* ========================================
   MODEL
======================================== */

const NotificationLog =
  mongoose.model(
    "NotificationLog",
    notificationLogSchema
  );

export default NotificationLog;