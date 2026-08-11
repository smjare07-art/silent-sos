const requiredVariables = [
  "MONGO_URI",
  "JWT_SECRET",
];

const validateEnv = () => {
  const missingVariables =
    requiredVariables.filter(
      (variable) =>
        !process.env[variable]
    );

  if (
    missingVariables.length > 0
  ) {
    console.error(
      "Missing required environment variables:"
    );

    missingVariables.forEach(
      (variable) => {
        console.error(
          `- ${variable}`
        );
      }
    );

    process.exit(1);
  }

  if (
    process.env.JWT_SECRET.length <
    32
  ) {
    console.error(
      "JWT_SECRET must be at least 32 characters long."
    );

    process.exit(1);
  }
};

export default validateEnv;