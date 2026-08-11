import mongoose from "mongoose";

/* ========================================
   LOCATION SUB-SCHEMA
======================================== */

const locationSchema =
  new mongoose.Schema(
    {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },

      accuracy: {
        type: Number,
        default: null,
        min: 0,
      },

      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: false,
    }
  );

/* ========================================
   EMERGENCY CONTACT SNAPSHOT

   Stores the contact details that existed
   at the exact time the SOS was triggered.

   Later changes to EmergencyContact will
   not change historical alert records.
======================================== */

const contactSnapshotSchema =
  new mongoose.Schema(
    {
      contactId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "EmergencyContact",

        default: null,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      relationship: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },

      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
    {
      _id: false,
    }
  );

/* ========================================
   ALERT SCHEMA
======================================== */

const alertSchema =
  new mongoose.Schema(
    {
      /*
        Alert owner
      */

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      /*
        Human-readable emergency ID
      */

      alertCode: {
        type: String,

        required: true,

        unique: true,

        index: true,

        trim: true,
      },

      /*
        Emergency lifecycle
      */

      status: {
        type: String,

        enum: [
          "ACTIVE",
          "ACKNOWLEDGED",
          "RESOLVED",
          "CANCELLED",
        ],

        default: "ACTIVE",

        index: true,
      },

      /*
        How the alert was triggered
      */

      triggerType: {
        type: String,

        enum: [
          "SILENT_SOS",
        ],

        default:
          "SILENT_SOS",
      },

      /*
        Snapshot of emergency contacts
        at trigger time.
      */

      contactsSnapshot: {
        type: [
          contactSnapshotSchema,
        ],

        default: [],
      },
        acknowledgement: {
  token: {
    type: String,
    default: null,
    select: false,
  },

  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyContact",
    default: null,
  },

  acknowledgedAt: {
    type: Date,
    default: null,
  },
},
      /*
        Location where SOS
        was initially triggered.
      */


      initialLocation: {
        type:
          locationSchema,

        required: true,
      },

      /*
        Most recently known
        user location.
      */

      latestLocation: {
        type:
          locationSchema,

        required: true,
      },

      /*
        Recent location trail.

        Controller limits this array
        to avoid unlimited document
        growth.
      */

      locationHistory: {
        type: [
          locationSchema,
        ],

        default: [],
      },

      /*
        Emergency timestamps
      */

      triggeredAt: {
        type: Date,

        default:
          Date.now,

        index: true,
      },

      acknowledgedAt: {
        type: Date,

        default: null,
      },

      resolvedAt: {
        type: Date,

        default: null,
      },

      cancelledAt: {
        type: Date,

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
  Fast lookup for user's
  active/current alerts.
*/

alertSchema.index({
  user: 1,
  status: 1,
  createdAt: -1,
});

/*
  Fast alert history lookup.
*/

alertSchema.index({
  user: 1,
  triggeredAt: -1,
});

/* ========================================
   MODEL
======================================== */

const Alert =
  mongoose.model(
    "Alert",
    alertSchema
  );
 
export default Alert;