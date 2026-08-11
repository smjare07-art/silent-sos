import Alert from "../models/Alert.js";
import EmergencyContact from "../models/EmergencyContact.js";
import NotificationLog from "../models/NotificationLog.js";

import generateAlertCode from "../utils/generateAlertCode.js";

import {
  sendEmergencyNotifications,
} from "../services/notificationService.js";

/* ========================================
   HELPERS
======================================== */

const isValidLocation = (
  latitude,
  longitude
) => {
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const buildLocation = ({
  latitude,
  longitude,
  accuracy,
  timestamp,
}) => {
  return {
    latitude,
    longitude,

    accuracy:
      typeof accuracy === "number" &&
      Number.isFinite(accuracy) &&
      accuracy >= 0
        ? accuracy
        : null,

    timestamp:
      timestamp &&
      !Number.isNaN(
        new Date(timestamp).getTime()
      )
        ? new Date(timestamp)
        : new Date(),
  };
};

/* ========================================
   CREATE SOS ALERT
======================================== */

export const createAlert = async (
  req,
  res,
  next
) => {
  try {
    const {
      latitude,
      longitude,
      accuracy,
      timestamp,
    } = req.body;

    /* -------------------------------------
       Validate location
    ------------------------------------- */

    if (
      !isValidLocation(
        latitude,
        longitude
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "A valid location is required to activate SOS.",
      });
    }

    /* -------------------------------------
       Load active emergency contacts
    ------------------------------------- */

    const emergencyContacts =
      await EmergencyContact.find({
        user: req.user._id,
        isActive: true,
      })
        .sort({
          isPrimary: -1,
          createdAt: 1,
        })
        .lean();

    if (
      emergencyContacts.length === 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Add at least one emergency contact before activating SOS.",
      });
    }

    /* -------------------------------------
       Prevent multiple active alerts
    ------------------------------------- */

    const existingAlert =
      await Alert.findOne({
        user: req.user._id,

        status: {
          $in: [
            "ACTIVE",
            "ACKNOWLEDGED",
          ],
        },
      });

    if (existingAlert) {
      return res.status(409).json({
        success: false,

        message:
          "You already have an active emergency alert.",

        data: {
          alert:
            existingAlert,
        },
      });
    }

    /* -------------------------------------
       Build location
    ------------------------------------- */

    const location =
      buildLocation({
        latitude,
        longitude,
        accuracy,
        timestamp,
      });

    /* -------------------------------------
       Snapshot emergency contacts

       This protects historical alert data
       if contacts are later edited/deleted.
    ------------------------------------- */

    const contactsSnapshot =
      emergencyContacts.map(
        (contact) => ({
          contactId:
            contact._id,

          name:
            contact.name,

          relationship:
            contact.relationship ||
            "",

          phone:
            contact.phone,

          email:
            contact.email || "",

          isPrimary:
            Boolean(
              contact.isPrimary
            ),
        })
      );

    /* -------------------------------------
       Create alert
    ------------------------------------- */

    const alert =
      await Alert.create({
        user:
          req.user._id,

        alertCode:
          generateAlertCode(),

        status:
          "ACTIVE",

        triggerType:
          "SILENT_SOS",

        contactsSnapshot,

        initialLocation:
          location,

        latestLocation:
          location,

        locationHistory: [
          location,
        ],

        triggeredAt:
          new Date(),
      });

    /* -------------------------------------
       Send emergency notifications

       Notification failure must NOT
       delete/fail the emergency alert.

       The alert itself remains active.
    ------------------------------------- */

    let notificationResult = {
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    try {
      const result =
        await sendEmergencyNotifications({
          alert,
          user: req.user,
        });

      if (result) {
        notificationResult =
          result;
      }
    } catch (error) {
      console.error(
        "Emergency notification pipeline failed:",
        error.message
      );
    }

    return res.status(201).json({
      success: true,

      message:
        "Emergency alert activated.",

      data: {
        alert,

        notifications:
          notificationResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   GET ACTIVE ALERT
======================================== */

export const getActiveAlert = async (
  req,
  res,
  next
) => {
  try {
    const alert =
      await Alert.findOne({
        user:
          req.user._id,

        status: {
          $in: [
            "ACTIVE",
            "ACKNOWLEDGED",
          ],
        },
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      data: {
        alert:
          alert || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   UPDATE LIVE LOCATION
======================================== */

export const updateAlertLocation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        latitude,
        longitude,
        accuracy,
        timestamp,
      } = req.body;

      /* -----------------------------------
         Validate coordinates
      ----------------------------------- */

      if (
        !isValidLocation(
          latitude,
          longitude
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "A valid location is required.",
        });
      }

      /* -----------------------------------
         Find active alert belonging
         to authenticated user
      ----------------------------------- */

      const alert =
        await Alert.findOne({
          _id:
            req.params.id,

          user:
            req.user._id,

          status: {
            $in: [
              "ACTIVE",
              "ACKNOWLEDGED",
            ],
          },
        });

      if (!alert) {
        return res.status(404).json({
          success: false,

          message:
            "Active emergency alert not found.",
        });
      }

      const location =
        buildLocation({
          latitude,
          longitude,
          accuracy,
          timestamp,
        });

      /* -----------------------------------
         Update latest position
      ----------------------------------- */

      alert.latestLocation =
        location;

      alert.locationHistory.push(
        location
      );

      /*
        Prevent unlimited MongoDB
        document growth.

        Keep the latest 500
        location points.
      */

      if (
        alert.locationHistory
          .length > 500
      ) {
        alert.locationHistory =
          alert.locationHistory.slice(
            -500
          );
      }

      await alert.save();

      return res.status(200).json({
        success: true,

        message:
          "Location updated.",

        data: {
          latestLocation:
            alert.latestLocation,
        },
      });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   RESOLVE ALERT
======================================== */

export const resolveAlert = async (
  req,
  res,
  next
) => {
  try {
    const alert =
      await Alert.findOne({
        _id:
          req.params.id,

        user:
          req.user._id,

        status: {
          $in: [
            "ACTIVE",
            "ACKNOWLEDGED",
          ],
        },
      });

    if (!alert) {
      return res.status(404).json({
        success: false,

        message:
          "Active emergency alert not found.",
      });
    }

    alert.status =
      "RESOLVED";

    alert.resolvedAt =
      new Date();

    await alert.save();

    return res.status(200).json({
      success: true,

      message:
        "Emergency alert resolved.",

      data: {
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   CANCEL ALERT
======================================== */

export const cancelAlert = async (
  req,
  res,
  next
) => {
  try {
    /*
      Only ACTIVE alerts can be
      cancelled as accidental SOS.

      ACKNOWLEDGED emergencies should
      be resolved instead.
    */

    const alert =
      await Alert.findOne({
        _id:
          req.params.id,

        user:
          req.user._id,

        status:
          "ACTIVE",
      });

    if (!alert) {
      return res.status(404).json({
        success: false,

        message:
          "Active emergency alert not found.",
      });
    }

    alert.status =
      "CANCELLED";

    alert.cancelledAt =
      new Date();

    await alert.save();

    return res.status(200).json({
      success: true,

      message:
        "Emergency alert cancelled.",

      data: {
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   ALERT HISTORY
======================================== */

export const getAlertHistory =
  async (
    req,
    res,
    next
  ) => {
    try {
      const alerts =
        await Alert.find({
          user:
            req.user._id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .select(
            "-locationHistory"
          );

      return res.status(200).json({
        success: true,

        data: {
          count:
            alerts.length,

          alerts,
        },
      });
    } catch (error) {
      next(error);
    }
  };

/* ========================================
   GET ALERT NOTIFICATION STATUS
======================================== */

export const getAlertNotifications =
  async (
    req,
    res,
    next
  ) => {
    try {
      /*
        First verify that the alert
        belongs to this user.
      */

      const alert =
        await Alert.findOne({
          _id:
            req.params.id,

          user:
            req.user._id,
        });

      if (!alert) {
        return res.status(404).json({
          success: false,

          message:
            "Alert not found.",
        });
      }

      const notifications =
        await NotificationLog.find({
          alert:
            alert._id,

          user:
            req.user._id,
        })
          .sort({
            createdAt: 1,
          })
          .select(
            "-failureReason"
          );

      return res.status(200).json({
        success: true,

        data: {
          notifications,
        },
      });
    } catch (error) {
      next(error);
    }
  };