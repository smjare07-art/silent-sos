import nodemailer from "nodemailer";

let transporter = null;

export const getEmailTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const host =
    process.env.EMAIL_HOST ||
    "smtp.gmail.com";

  const port =
    Number(process.env.EMAIL_PORT) ||
    587;

  const secure =
    process.env.EMAIL_SECURE === "true";

  const user =
    process.env.EMAIL_USER;

  const password =
    process.env.EMAIL_APP_PASSWORD;

  if (!user || !password) {
    throw new Error(
      "Email credentials are not configured."
    );
  }

  console.log("Creating email transporter:", {
    host,
    port,
    secure,
    user,
  });

  transporter =
    nodemailer.createTransport({
      host,
      port,
      secure,

      auth: {
        user,
        pass: password,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

  return transporter;
};

export const verifyEmailConnection =
  async () => {
    try {
      const emailTransporter =
        getEmailTransporter();

      await emailTransporter.verify();

      console.log(
        "✅ Email service connected successfully"
      );

      return true;
    } catch (error) {
      console.error(
        "❌ Email service connection failed:"
      );

      console.error({
        message: error.message,
        code: error.code,
        command: error.command,
        address: error.address,
        port: error.port,
      });

      return false;
    }
  };