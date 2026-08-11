import twilio from "twilio";

let client = null;

const getSmsClient = () => {
  if (client) {
    return client;
  }

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
  } = process.env;

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN
  ) {
    throw new Error(
      "Twilio credentials are not configured."
    );
  }

  client = twilio(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  );

  return client;
};

/* ========================================
   NORMALIZE PHONE NUMBER
======================================== */

const normalizePhoneNumber = (phone) => {
  if (!phone) {
    throw new Error(
      "SMS recipient phone number is required."
    );
  }

  let normalized =
    String(phone)
      .trim()
      .replace(/[\s()-]/g, "");

  if (normalized.startsWith("+")) {
    return normalized;
  }

  if (/^[6-9]\d{9}$/.test(normalized)) {
    return `+91${normalized}`;
  }

  if (
    /^91[6-9]\d{9}$/.test(normalized)
  ) {
    return `+${normalized}`;
  }

  throw new Error(
    `Invalid phone number format: ${phone}`
  );
};

/* ========================================
   SEND SMS
======================================== */

export const sendSms = async ({
  to,
  body,
}) => {
  const smsClient =
    getSmsClient();

  const phoneNumber =
    normalizePhoneNumber(to);

  const from =
    process.env.TWILIO_PHONE_NUMBER;

  if (!from) {
    throw new Error(
      "TWILIO_PHONE_NUMBER is not configured."
    );
  }

  console.log(
    "Sending SMS:",
    {
      from,
      to: phoneNumber,
    }
  );

  try {
    const message =
      await smsClient.messages.create({
        body,
        from,
        to: phoneNumber,
      });

    console.log(
      "Twilio SMS accepted:",
      {
        sid: message.sid,
        status: message.status,
        to: phoneNumber,
      }
    );

    return message;

  } catch (error) {

    console.error(
      "TWILIO SMS ERROR:",
      {
        code: error.code,
        status: error.status,
        message: error.message,
        moreInfo: error.moreInfo,
      }
    );

    throw new Error(
      `Twilio SMS failed: ${error.message}`
    );
  }
};