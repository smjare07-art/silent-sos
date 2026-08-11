import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  resetPassword,
} from "../services/authService";

import "../styles/auth.css";

function ResetPassword() {
  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  /* ========================================
     PASSWORD CHECKS
  ======================================== */

  const passwordChecks = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(
        password
      ),

    lowercase:
      /[a-z]/.test(
        password
      ),

    number:
      /[0-9]/.test(
        password
      ),
  };

  const passwordValid =
    Object.values(
      passwordChecks
    ).every(Boolean);

  const passwordsMatch =
    password.length > 0 &&
    password ===
      confirmPassword;

  /* ========================================
     SUBMIT
  ======================================== */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setError("");
      setSuccess("");

      if (!token) {
        setError(
          "Password reset link is invalid."
        );

        return;
      }

      if (!passwordValid) {
        setError(
          "Please make sure your password meets all security requirements."
        );

        return;
      }

      if (!passwordsMatch) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      setIsSubmitting(
        true
      );

      try {
        const response =
          await resetPassword(
            token,
            password
          );

        setSuccess(
          response.message ||
            "Password reset successfully."
        );

        /*
          Redirect to login after
          successful password reset.
        */

        setTimeout(() => {
          navigate(
            "/login?reset=success",
            {
              replace: true,
            }
          );
        }, 2000);
      } catch (error) {
        console.error(
          "Password reset failed:",
          error
        );

        const validationMessage =
          error.response?.data
            ?.errors?.[0]
            ?.message;

        setError(
          validationMessage ||
            error.response?.data
              ?.message ||
            "Unable to reset your password. The link may be invalid or expired."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  return (
    <main className="auth-page">

      <div className="container">

        <div className="row justify-content-center align-items-center min-vh-100 py-4">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            {/* Logo */}

            <div className="text-center mb-4">

              <div className="auth-logo mx-auto mb-3">
                <i className="bi bi-shield-lock-fill"></i>
              </div>

              <h1 className="auth-brand">
                Silent SOS
              </h1>

              <p className="text-muted mb-0">
                Secure account recovery
              </p>

            </div>

            {/* Card */}

            <div className="auth-card">

              <div className="mb-4">

                <h2 className="auth-title">
                  Create new password
                </h2>

                <p className="text-muted mb-0">
                  Choose a strong password
                  for your Silent SOS
                  account.
                </p>

              </div>

              {/* Success */}

              {success && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>

                  {success}

                  <div className="small mt-2">
                    Redirecting to
                    sign in...
                  </div>
                </div>
              )}

              {/* Error */}

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>

                  {error}
                </div>
              )}

              {!success && (
                <form
                  onSubmit={
                    handleSubmit
                  }
                >

                  {/* Password */}

                  <div className="mb-3">

                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      New Password
                    </label>

                    <div className="input-group auth-input-group">

                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        value={
                          password
                        }
                        onChange={(
                          event
                        ) => {
                          setPassword(
                            event.target
                              .value
                          );

                          setError("");
                        }}
                        disabled={
                          isSubmitting
                        }
                        required
                      />

                      <button
                        type="button"
                        className="input-group-text password-toggle"
                        onClick={() =>
                          setShowPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <i
                          className={`bi ${
                            showPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>

                    </div>

                  </div>

                  {/* Requirements */}

                  <div className="mb-4">

                    <small className="text-muted d-block mb-2">
                      Password must
                      contain:
                    </small>

                    <div className="d-flex flex-column gap-1 small">

                      <PasswordCheck
                        valid={
                          passwordChecks.length
                        }
                        text="At least 8 characters"
                      />

                      <PasswordCheck
                        valid={
                          passwordChecks.uppercase
                        }
                        text="One uppercase letter"
                      />

                      <PasswordCheck
                        valid={
                          passwordChecks.lowercase
                        }
                        text="One lowercase letter"
                      />

                      <PasswordCheck
                        valid={
                          passwordChecks.number
                        }
                        text="One number"
                      />

                    </div>

                  </div>

                  {/* Confirm Password */}

                  <div className="mb-4">

                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm Password
                    </label>

                    <div className="input-group auth-input-group">

                      <span className="input-group-text">
                        <i className="bi bi-lock-fill"></i>
                      </span>

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control"
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        value={
                          confirmPassword
                        }
                        onChange={(
                          event
                        ) => {
                          setConfirmPassword(
                            event.target
                              .value
                          );

                          setError("");
                        }}
                        disabled={
                          isSubmitting
                        }
                        required
                      />

                      <button
                        type="button"
                        className="input-group-text password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>

                    </div>

                    {confirmPassword && (
                      <div
                        className={`small mt-2 ${
                          passwordsMatch
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        <i
                          className={`bi ${
                            passwordsMatch
                              ? "bi-check-circle-fill"
                              : "bi-x-circle-fill"
                          } me-1`}
                        ></i>

                        {passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </div>
                    )}

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="btn btn-sos w-100"
                    disabled={
                      isSubmitting ||
                      !passwordValid ||
                      !passwordsMatch
                    }
                  >

                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>

                        Updating
                        password...
                      </>
                    ) : (
                      <>
                        Reset Password

                        <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}

                  </button>

                </form>
              )}

              <div className="auth-divider">
                <span>
                  Remember your
                  password?
                </span>
              </div>

              <Link
                to="/login"
                className="btn btn-outline-dark w-100 auth-secondary-btn"
              >
                Back to Sign In
              </Link>

            </div>

            <div className="auth-security text-center mt-4">

              <i className="bi bi-shield-lock me-2"></i>

              Your reset link is
              temporary and single-use.

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

/* ========================================
   PASSWORD CHECK COMPONENT
======================================== */

function PasswordCheck({
  valid,
  text,
}) {
  return (
    <span
      className={
        valid
          ? "text-success"
          : "text-muted"
      }
    >
      <i
        className={`bi ${
          valid
            ? "bi-check-circle-fill"
            : "bi-circle"
        } me-2`}
      ></i>

      {text}
    </span>
  );
}

export default ResetPassword;