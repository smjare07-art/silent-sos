const passwordResetEmail = ({
  userName,
  resetUrl,
  expiresInMinutes = 15,
}) => {
  const subject =
    "Reset your Silent SOS password";

  const text = `
Hello ${userName},

We received a request to reset the password for your Silent SOS account.

Reset your password using the link below:

${resetUrl}

This link will expire in ${expiresInMinutes} minutes.

If you did not request a password reset, you can safely ignore this email.

For your security, never share this reset link with anyone.

Silent SOS
Safety Network
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Password Reset</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #212529;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="
      background-color: #f4f6f8;
      padding: 40px 15px;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
            max-width: 600px;
            background: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow:
              0 8px 30px
              rgba(0, 0, 0, 0.08);
          "
        >

          <!-- Header -->

          <tr>
            <td
              style="
                background: #dc3545;
                padding: 28px;
                text-align: center;
                color: white;
              "
            >

              <div
                style="
                  font-size: 30px;
                  margin-bottom: 8px;
                "
              >
                🛡️
              </div>

              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                "
              >
                Silent SOS
              </h1>

              <p
                style="
                  margin: 8px 0 0;
                  opacity: 0.9;
                  font-size: 14px;
                "
              >
                Safety Network
              </p>

            </td>
          </tr>

          <!-- Content -->

          <tr>
            <td
              style="
                padding: 35px;
              "
            >

              <h2
                style="
                  margin-top: 0;
                  font-size: 22px;
                  color: #212529;
                "
              >
                Reset your password
              </h2>

              <p
                style="
                  line-height: 1.6;
                  color: #495057;
                "
              >
                Hello
                <strong>${userName}</strong>,
              </p>

              <p
                style="
                  line-height: 1.6;
                  color: #495057;
                "
              >
                We received a request to
                reset the password for your
                Silent SOS account.
              </p>

              <p
                style="
                  line-height: 1.6;
                  color: #495057;
                "
              >
                Click the button below to
                create a new password.
              </p>

              <!-- Button -->

              <div
                style="
                  text-align: center;
                  margin: 32px 0;
                "
              >

                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    background-color: #dc3545;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 15px;
                  "
                >
                  Reset Password
                </a>

              </div>

              <!-- Expiry -->

              <div
                style="
                  background: #fff3cd;
                  border: 1px solid #ffecb5;
                  border-radius: 8px;
                  padding: 14px;
                  margin-bottom: 24px;
                  color: #664d03;
                  font-size: 14px;
                  line-height: 1.5;
                "
              >
                ⏱ This password reset link
                expires in
                <strong>
                  ${expiresInMinutes} minutes
                </strong>.
              </div>

              <p
                style="
                  line-height: 1.6;
                  color: #6c757d;
                  font-size: 14px;
                "
              >
                If you did not request this
                password reset, you can safely
                ignore this email. Your password
                will remain unchanged.
              </p>

              <hr
                style="
                  border: 0;
                  border-top: 1px solid #e9ecef;
                  margin: 28px 0;
                "
              />

              <p
                style="
                  color: #6c757d;
                  font-size: 13px;
                  line-height: 1.5;
                "
              >
                If the button does not work,
                copy and paste this link into
                your browser:
              </p>

              <p
                style="
                  word-break: break-all;
                  font-size: 12px;
                  color: #495057;
                "
              >
                ${resetUrl}
              </p>

            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              style="
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #6c757d;
                font-size: 12px;
              "
            >

              Silent SOS — Personal Safety Network

              <br />

              This is an automated security
              message.

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  return {
    subject,
    text,
    html,
  };
};

export default passwordResetEmail;