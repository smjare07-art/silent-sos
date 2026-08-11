import crypto from "crypto";

const generateAlertCode = () => {
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  const timePart = Date.now()
    .toString()
    .slice(-6);

  return `SOS-${timePart}-${randomPart}`;
};

export default generateAlertCode;