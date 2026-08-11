import crypto from "crypto";

import {
  getEmailTransporter,
} from "../config/email.js";

import { sendSms } from "../config/sms.js";

import EmergencyContact from "../models/EmergencyContact.js";

import NotificationLog from "../models/NotificationLog.js";

import emergencyEmail from "../templates/emergencyEmail.js";

/* ========================================
   SEND EMERGENCY NOTIFICATIONS
======================================== */

export const sendEmergencyNotifications =
  async ({ alert, user }) => {

    const transporter =
      getEmailTransporter();

    const contacts =
      await EmergencyContact.find({
        user: user._id,
        isActive: true,
      }).sort({
        isPrimary: -1,
      });

    if (contacts.length === 0) {
      return {
        sent: 0,
        failed: 0,
        skipped: 0,
      };
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    /* ========================================
       PROCESS EACH CONTACT
    ======================================== */

    for (const contact of contacts) {

      /* ========================================
         EMAIL NOTIFICATION
      ======================================== */

      if (contact.email) {

        const acknowledgementToken =
          crypto
            .randomBytes(32)
            .toString("hex");

        const log =
          await NotificationLog.create({

            alert: alert._id,

            user: user._id,

            contact: contact._id,

            recipientName:
              contact.name,

            recipient:
              contact.email,

            channel:
              "EMAIL",

            status:
              "PENDING",

            acknowledgementToken,

            acknowledgementStatus:
              "PENDING",
          });

        try {

          const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

          const acknowledgementUrl =
            `${frontendUrl}/acknowledge/${acknowledgementToken}`;

          const template =
            emergencyEmail({

              userName:
                user.name,

              contactName:
                contact.name,

              alertCode:
                alert.alertCode,

              latitude:
                alert.initialLocation.latitude,

              longitude:
                alert.initialLocation.longitude,

              accuracy:
                alert.initialLocation.accuracy,

              triggeredAt:
                alert.triggeredAt,

              acknowledgementUrl,
            });

          const info =
            await transporter.sendMail({

              from: {
                name:
                  process.env
                    .EMAIL_FROM_NAME ||
                  "Silent SOS",

                address:
                  process.env.EMAIL_USER,
              },

              to:
                contact.email,

              subject:
                template.subject,

              text:
                template.text,

              html:
                template.html,
            });

          log.status =
            "SENT";

          log.providerMessageId =
            info.messageId || null;

          log.sentAt =
            new Date();

          await log.save();

          results.sent += 1;

        } catch (error) {

          log.status =
            "FAILED";

          log.failureReason =
            error.message;

          await log.save();

          results.failed += 1;

          console.error(
            `Emergency email failed for ${contact.email}:`,
            error.message
          );
        }

      } else {

        await NotificationLog.create({

          alert: alert._id,

          user: user._id,

          contact: contact._id,

          recipientName:
            contact.name,

          recipient:
            contact.phone,

          channel:
            "EMAIL",

          status:
            "SKIPPED",

          acknowledgementStatus:
            "PENDING",

          failureReason:
            "Emergency contact has no email address.",
        });

        results.skipped += 1;
      }

      /* ========================================
         SMS NOTIFICATION
      ======================================== */

      if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER &&
        contact.phone
      ) {

        const smsLog =
          await NotificationLog.create({

            alert: alert._id,

            user: user._id,

            contact: contact._id,

            recipientName:
              contact.name,

            recipient:
              contact.phone,

            channel:
              "SMS",

            status:
              "PENDING",
          });

        try {

          const smsBody =
`🚨 SILENT SOS ALERT

${user.name} has activated a Silent SOS emergency alert.

Alert ID: ${alert.alertCode}

Location:
https://www.google.com/maps?q=${alert.initialLocation.latitude},${alert.initialLocation.longitude}

Please check on them immediately.

This is an automated emergency notification from Silent SOS.`;

          const message =
            await sendSms({

              to:
                contact.phone,

              body:
                smsBody,
            });

          smsLog.status =
            "SENT";

          smsLog.providerMessageId =
            message.sid || null;

          smsLog.sentAt =
            new Date();

          await smsLog.save();

          results.sent += 1;

          console.log(
            `Emergency SMS sent to ${contact.phone}`
          );

        } catch (error) {

          smsLog.status =
            "FAILED";

          smsLog.failureReason =
            error.message;

          await smsLog.save();

          results.failed += 1;

          console.error(
            `Emergency SMS failed for ${contact.phone}:`,
            error.message
          );
        }

      } else {

        await NotificationLog.create({

          alert: alert._id,

          user: user._id,

          contact: contact._id,

          recipientName:
            contact.name,

          recipient:
            contact.phone,

          channel:
            "SMS",

          status:
            "SKIPPED",

          failureReason:
            "Twilio SMS configuration or contact phone number is unavailable.",
        });

        results.skipped += 1;
      }
    }

    return results;
  };