import User from "../models/User.js";
import Alert from "../models/Alert.js";
import EmergencyContact from "../models/EmergencyContact.js";
import NotificationLog from "../models/NotificationLog.js";

/* ========================================
   ADMIN DASHBOARD OVERVIEW
======================================== */

export const getAdminOverview = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalContacts,
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      cancelledAlerts,
      sentNotifications,
      failedNotifications,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isActive: true,
      }),

      EmergencyContact.countDocuments({
        isActive: true,
      }),

      Alert.countDocuments(),

      Alert.countDocuments({
        status: {
          $in: [
            "ACTIVE",
            "ACKNOWLEDGED",
          ],
        },
      }),

      Alert.countDocuments({
        status: "RESOLVED",
      }),

      Alert.countDocuments({
        status: "CANCELLED",
      }),

      NotificationLog.countDocuments({
        status: "SENT",
      }),

      NotificationLog.countDocuments({
        status: "FAILED",
      }),
    ]);

    res.status(200).json({
      success: true,

      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
        },

        emergencyContacts:
          totalContacts,

        alerts: {
          total: totalAlerts,
          active: activeAlerts,
          resolved: resolvedAlerts,
          cancelled: cancelledAlerts,
        },

        notifications: {
          sent: sentNotifications,
          failed: failedNotifications,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
/* ========================================
   GET ALL USERS
======================================== */

export const getAdminUsers = async (
  req,
  res,
  next
) => {
  try {
    const users = await User.find()
      .select(
        "name email phone role isActive isEmailVerified lastLogin createdAt"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      data: {
        count: users.length,
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   UPDATE USER STATUS
======================================== */

export const updateUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
      Prevent admin from disabling
      their own account.
    */

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot disable your own admin account.",
      });
    }

    user.isActive = isActive;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,

      message: isActive
        ? "User account enabled successfully."
        : "User account disabled successfully.",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================
   UPDATE USER ROLE
======================================== */

export const updateUserRole = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    if (
      !["user", "admin"].includes(
        role
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be either user or admin.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
      Prevent admin from changing
      their own role.
    */

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own admin role.",
      });
    }

    user.role = role;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,

      message:
        "User role updated successfully.",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
/* ========================================
   GET ALL EMERGENCY ALERTS
======================================== */

export const getAdminAlerts = async (
  req,
  res,
  next
) => {
  try {
    const alerts = await Alert.find()
      .populate(
        "user",
        "name email phone role"
      )
      .sort({
        triggeredAt: -1,
      })
      .limit(100)
      .select(
        "-locationHistory -acknowledgement"
      )
      .lean();

    res.status(200).json({
      success: true,

      data: {
        count: alerts.length,
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};


/* ========================================
   GET SINGLE EMERGENCY ALERT
======================================== */

export const getAdminAlertDetails = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const alert =
      await Alert.findById(id)
        .populate(
          "user",
          "name email phone role isActive"
        )
        .lean();

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Emergency alert not found.",
      });
    }

    res.status(200).json({
      success: true,

      data: {
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await NotificationLog.find()
        .sort({
          createdAt: -1,
        })
        .limit(200);

    res.status(200).json({
      success: true,

      data: {
        count: notifications.length,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};
/* ========================================
   KPI ANALYTICS
======================================== */

export const getAdminKpis = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalAlerts,
      resolvedAlerts,
      cancelledAlerts,
      activeAlerts,
      totalNotifications,
      sentNotifications,
      failedNotifications,
      skippedNotifications,
      acknowledgedNotifications,
    ] = await Promise.all([
      /* Alerts */

      Alert.countDocuments(),

      Alert.countDocuments({
        status: "RESOLVED",
      }),

      Alert.countDocuments({
        status: "CANCELLED",
      }),

      Alert.countDocuments({
        status: {
          $in: [
            "ACTIVE",
            "ACKNOWLEDGED",
          ],
        },
      }),

      /* Notifications */

      NotificationLog.countDocuments(),

      NotificationLog.countDocuments({
        status: "SENT",
      }),

      NotificationLog.countDocuments({
        status: "FAILED",
      }),

      NotificationLog.countDocuments({
        status: "SKIPPED",
      }),

      NotificationLog.countDocuments({
        status: "ACKNOWLEDGED",
      }),
    ]);

    /* ========================================
       DELIVERY SUCCESS RATE
    ======================================== */

    const attemptedNotifications =
      sentNotifications +
      failedNotifications;

    const deliverySuccessRate =
      attemptedNotifications > 0
        ? (
            (sentNotifications /
              attemptedNotifications) *
            100
          ).toFixed(1)
        : "0.0";

    /* ========================================
       ACKNOWLEDGEMENT RATE
    ======================================== */

    const acknowledgementRate =
      sentNotifications > 0
        ? (
            (acknowledgedNotifications /
              sentNotifications) *
            100
          ).toFixed(1)
        : "0.0";

    /* ========================================
       ALERT RESOLUTION RATE
    ======================================== */

    const completedAlerts =
      resolvedAlerts +
      cancelledAlerts;

    const resolutionRate =
      completedAlerts > 0
        ? (
            (resolvedAlerts /
              completedAlerts) *
            100
          ).toFixed(1)
        : "0.0";

    /* ========================================
       AVERAGE ALERT DELIVERY TIME
       
       triggeredAt → sentAt
    ======================================== */

    const deliveryStats =
      await NotificationLog.aggregate([
        {
          $match: {
            status: "SENT",
            sentAt: {
              $ne: null,
            },
          },
        },

        {
          $lookup: {
            from: "alerts",

            localField: "alert",

            foreignField: "_id",

            as: "alertData",
          },
        },

        {
          $unwind:
            "$alertData",
        },

        {
          $match: {
            "alertData.triggeredAt": {
              $ne: null,
            },
          },
        },

        {
          $project: {
            deliveryTime: {
              $subtract: [
                "$sentAt",
                "$alertData.triggeredAt",
              ],
            },
          },
        },

        {
          $group: {
            _id: null,

            averageDeliveryTime: {
              $avg:
                "$deliveryTime",
            },

            fastestDeliveryTime: {
              $min:
                "$deliveryTime",
            },

            slowestDeliveryTime: {
              $max:
                "$deliveryTime",
            },
          },
        },
      ]);

    const delivery =
      deliveryStats[0] || {};

    const averageDeliveryMs =
      delivery.averageDeliveryTime || 0;

    const fastestDeliveryMs =
      delivery.fastestDeliveryTime || 0;

    const slowestDeliveryMs =
      delivery.slowestDeliveryTime || 0;

    /* ========================================
       RESPONSE
    ======================================== */

    res.status(200).json({
      success: true,

      data: {
        alerts: {
          total: totalAlerts,

          active: activeAlerts,

          resolved: resolvedAlerts,

          cancelled: cancelledAlerts,

          resolutionRate:
            Number(resolutionRate),
        },

        notifications: {
          total: totalNotifications,

          sent: sentNotifications,

          failed: failedNotifications,

          skipped: skippedNotifications,

          acknowledged:
            acknowledgedNotifications,

          deliverySuccessRate:
            Number(
              deliverySuccessRate
            ),

          acknowledgementRate:
            Number(
              acknowledgementRate
            ),
        },

        delivery: {
          averageMs:
            Math.round(
              averageDeliveryMs
            ),

          averageSeconds:
            Number(
              (
                averageDeliveryMs /
                1000
              ).toFixed(2)
            ),

          fastestSeconds:
            Number(
              (
                fastestDeliveryMs /
                1000
              ).toFixed(2)
            ),

          slowestSeconds:
            Number(
              (
                slowestDeliveryMs /
                1000
              ).toFixed(2)
            ),
        },

        system: {
          status: "ONLINE",

          uptime: null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};