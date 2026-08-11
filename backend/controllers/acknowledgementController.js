import crypto from "crypto";

import Alert from "../models/Alert.js";
import NotificationLog from "../models/NotificationLog.js";

/* ========================================
   ACKNOWLEDGE EMERGENCY
======================================== */

export const acknowledgeEmergency =
  async (req, res, next) => {
    try {
      const { token } =
        req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "Acknowledgement token is required.",
        });
      }

      /*
        Hash the token received from
        the email link.

        Database stores only the hash.
      */

      const tokenHash =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      /*
        Find acknowledgement record.

        IMPORTANT:
        acknowledgementToken is select:false,
        so explicitly use +acknowledgementToken.
      */

      const notification =
        await NotificationLog.findOne({
          acknowledgementToken:
            tokenHash,

          channel: "EMAIL",
        }).select(
          "+acknowledgementToken"
        );

      /*
        Invalid token
      */

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "This acknowledgement link is invalid or has expired.",
        });
      }

      /*
        Already acknowledged.

        Return 200 instead of 404.
        This makes the endpoint idempotent.
      */

      if (
        notification.acknowledgementStatus ===
        "ACKNOWLEDGED"
      ) {
        const alert =
          await Alert.findById(
            notification.alert
          );

        return res.status(200).json({
          success: true,

          alreadyAcknowledged:
            true,

          message:
            "This emergency has already been acknowledged.",

          data: {
            contactName:
              notification.recipientName,

            alertCode:
              alert?.alertCode || null,

            status:
              alert?.status ||
              "ACKNOWLEDGED",

            acknowledgedAt:
              notification.acknowledgedAt,
          },
        });
      }

      /*
        Find associated alert
      */

      const alert =
        await Alert.findById(
          notification.alert
        );

      if (!alert) {
        return res.status(404).json({
          success: false,
          message:
            "Associated emergency alert no longer exists.",
        });
      }

      /*
        Mark notification as acknowledged
      */

      notification.acknowledgementStatus =
        "ACKNOWLEDGED";

      notification.acknowledgedAt =
        new Date();

      /*
        IMPORTANT:
        DO NOT set acknowledgementToken
        to null.

        Keeping the token allows the same
        acknowledgement link to safely return
        "already acknowledged" instead of 404.
      */

      await notification.save();

      /*
        Update alert status.

        Only ACTIVE alerts should become
        ACKNOWLEDGED.
      */

      if (
        alert.status ===
        "ACTIVE"
      ) {
        alert.status =
          "ACKNOWLEDGED";

        alert.acknowledgedAt =
          new Date();

        await alert.save();
      }

      return res.status(200).json({
        success: true,

        alreadyAcknowledged:
          false,

        message:
          "Emergency acknowledged successfully.",

        data: {
          contactName:
            notification.recipientName,

          alertCode:
            alert.alertCode,

          status:
            alert.status,

          acknowledgedAt:
            notification.acknowledgedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };