const emergencyEmail = ({
  userName,
  contactName,
  alertCode,
  latitude,
  longitude,
  accuracy,
  triggeredAt,
  acknowledgementUrl,
}) => {
  const formattedTime =
    new Date(
      triggeredAt
    ).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });

  const mapsUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}`;

  const accuracyText =
    accuracy !== null &&
    accuracy !== undefined
      ? `±${Math.round(
          accuracy
        )} meters`
      : "Unknown";

  return {
    subject:
      `🚨 Silent SOS Alert — ${userName}`,

    text: `
SILENT SOS EMERGENCY ALERT

Hello ${contactName},

${userName} has activated a Silent SOS emergency alert.

Please check on them as soon as possible.

ALERT DETAILS
-------------------------
Alert ID: ${alertCode}
User: ${userName}
Triggered: ${formattedTime}

LOCATION
-------------------------
Latitude: ${latitude}
Longitude: ${longitude}
GPS Accuracy: ${accuracyText}

View Location:
${mapsUrl}

ACKNOWLEDGE EMERGENCY
-------------------------
If you have received this alert and are responding to the emergency, use the acknowledgement link below:

${acknowledgementUrl}

This acknowledgement helps ${userName} know that someone has received the emergency alert.

IMPORTANT SAFETY NOTICE
-------------------------
Silent SOS is a safety-support system and does not replace official emergency services.

If the situation is life-threatening, contact the appropriate emergency service immediately.

This is an automated emergency notification from Silent SOS.
`,

    html: `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Silent SOS Emergency Alert
  </title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:Arial,Helvetica,sans-serif;
    color:#1f2937;
  "
>

  <div
    style="
      max-width:640px;
      margin:30px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 8px 30px rgba(0,0,0,0.08);
    "
  >

    <!-- HEADER -->

    <div
      style="
        background:#dc2626;
        color:#ffffff;
        padding:28px 30px;
      "
    >

      <div
        style="
          font-size:13px;
          font-weight:bold;
          letter-spacing:1px;
          opacity:0.9;
        "
      >
        SILENT SOS
      </div>

      <h1
        style="
          margin:8px 0 0;
          font-size:26px;
          line-height:1.3;
        "
      >
        🚨 Emergency Alert
      </h1>

      <p
        style="
          margin:8px 0 0;
          font-size:15px;
          opacity:0.95;
        "
      >
        Immediate attention may be required.
      </p>

    </div>


    <!-- CONTENT -->

    <div
      style="
        padding:30px;
      "
    >

      <p
        style="
          margin-top:0;
          font-size:16px;
        "
      >
        Hello
        <strong>${contactName}</strong>,
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.6;
        "
      >
        <strong>${userName}</strong>
        has activated a
        <strong>Silent SOS</strong>
        emergency alert.
      </p>

      <p
        style="
          font-size:15px;
          line-height:1.6;
          color:#4b5563;
        "
      >
        Please check on them as soon as
        possible and take appropriate action.
      </p>


      <!-- ALERT DETAILS -->

      <div
        style="
          margin-top:24px;
          padding:20px;
          background:#fef2f2;
          border:1px solid #fecaca;
          border-radius:12px;
        "
      >

        <h2
          style="
            margin:0 0 15px;
            font-size:17px;
            color:#991b1b;
          "
        >
          Alert Details
        </h2>

        <p
          style="
            margin:8px 0;
            font-size:14px;
          "
        >
          <strong>Alert ID:</strong>
          ${alertCode}
        </p>

        <p
          style="
            margin:8px 0;
            font-size:14px;
          "
        >
          <strong>User:</strong>
          ${userName}
        </p>

        <p
          style="
            margin:8px 0;
            font-size:14px;
          "
        >
          <strong>Triggered:</strong>
          ${formattedTime}
        </p>

      </div>


      <!-- LOCATION -->

      <div
        style="
          margin-top:20px;
          padding:20px;
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:12px;
        "
      >

        <h2
          style="
            margin:0 0 15px;
            font-size:17px;
            color:#111827;
          "
        >
          📍 Emergency Location
        </h2>

        <p
          style="
            margin:7px 0;
            font-size:14px;
          "
        >
          <strong>Latitude:</strong>
          ${latitude}
        </p>

        <p
          style="
            margin:7px 0;
            font-size:14px;
          "
        >
          <strong>Longitude:</strong>
          ${longitude}
        </p>

        <p
          style="
            margin:7px 0 18px;
            font-size:14px;
          "
        >
          <strong>GPS Accuracy:</strong>
          ${accuracyText}
        </p>

        <a
          href="${mapsUrl}"
          target="_blank"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#111827;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-size:14px;
            font-weight:bold;
          "
        >
          📍 Open Location in Google Maps
        </a>

      </div>


      <!-- ACKNOWLEDGEMENT -->

      <div
        style="
          margin-top:24px;
          padding:24px;
          background:#ecfdf5;
          border:1px solid #a7f3d0;
          border-radius:12px;
          text-align:center;
        "
      >

        <h2
          style="
            margin:0 0 10px;
            color:#065f46;
            font-size:19px;
          "
        >
          Have you received this alert?
        </h2>

        <p
          style="
            margin:0 0 20px;
            color:#374151;
            font-size:14px;
            line-height:1.6;
          "
        >
          If you have received this notification
          and are responding to the emergency,
          acknowledge it so the user knows
          someone has received the alert.
        </p>

        <a
          href="${acknowledgementUrl}"
          target="_blank"
          style="
            display:inline-block;
            padding:14px 28px;
            background:#059669;
            color:#ffffff;
            text-decoration:none;
            border-radius:9px;
            font-size:15px;
            font-weight:bold;
          "
        >
          ✓ Acknowledge Emergency
        </a>

      </div>


      <!-- SAFETY NOTICE -->

      <div
        style="
          margin-top:25px;
          padding:18px;
          background:#fffbeb;
          border:1px solid #fde68a;
          border-radius:10px;
        "
      >

        <p
          style="
            margin:0;
            font-size:13px;
            line-height:1.6;
            color:#78350f;
          "
        >
          <strong>Important:</strong>
          Silent SOS is a safety-support system
          and does not replace official emergency
          services. If the situation is
          life-threatening, contact the appropriate
          emergency service immediately.
        </p>

      </div>

    </div>


    <!-- FOOTER -->

    <div
      style="
        padding:20px 30px;
        background:#f9fafb;
        border-top:1px solid #e5e7eb;
        text-align:center;
      "
    >

      <p
        style="
          margin:0;
          font-size:12px;
          color:#6b7280;
          line-height:1.5;
        "
      >
        This is an automated emergency
        notification from Silent SOS.
      </p>

    </div>

  </div>

</body>

</html>
`,
  };
};

export default emergencyEmail;