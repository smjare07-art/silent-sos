import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  forgotPassword,
} from "../services/authService";

import "../styles/auth.css";

function ForgotPassword() {
  const [
    email,
    setEmail,
  ] = useState("");

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

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setError("");
      setSuccess("");

      setIsSubmitting(true);

      try {
        const response =
          await forgotPassword(
            email.trim()
          );

        setSuccess(
          response.message ||
            "If an account exists for this email, a password reset link has been sent."
        );
      } catch (error) {
        console.error(
          "Forgot password failed:",
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
            "Unable to process your request. Please try again."
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

                <Link
                  to="/login"
                  className="auth-link d-inline-flex align-items-center mb-3"
                >
                  <i className="bi bi-arrow-left me-2"></i>

                  Back to sign in
                </Link>

                <h2 className="auth-title">
                  Forgot password?
                </h2>

                <p className="text-muted mb-0">
                  Enter the email address
                  associated with your
                  Silent SOS account.
                </p>

              </div>

              {/* Success */}

              {success && (
                <div
                  className="alert alert-success"
                  role="alert"
                >

                  <div className="d-flex gap-2">

                    <i className="bi bi-check-circle-fill mt-1"></i>

                    <div>
                      {success}
                    </div>

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

              {!success ? (

                <form
                  onSubmit={
                    handleSubmit
                  }
                >

                  {/* Email */}

                  <div className="mb-4">

                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email address
                    </label>

                    <div className="input-group auth-input-group">

                      <span className="input-group-text">

                        <i className="bi bi-envelope"></i>

                      </span>

                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(
                          event
                        ) => {
                          setEmail(
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

                    </div>

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="btn btn-sos w-100"
                    disabled={
                      isSubmitting
                    }
                  >

                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>

                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Reset Link

                        <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}

                  </button>

                </form>

              ) : (

                <div>

                  <div className="text-center my-4">

                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success"
                      style={{
                        width:
                          "64px",

                        height:
                          "64px",

                        fontSize:
                          "1.6rem",
                      }}
                    >
                      <i className="bi bi-envelope-check"></i>
                    </div>

                    <strong className="d-block">
                      Check your email
                    </strong>

                    <span className="text-muted small">
                      The reset link is
                      valid for 15 minutes.
                    </span>

                  </div>

                  <Link
                    to="/login"
                    className="btn btn-outline-dark w-100 auth-secondary-btn"
                  >
                    Return to Sign In
                  </Link>

                </div>

              )}

            </div>

            {/* Security */}

            <div className="auth-security text-center mt-4">

              <i className="bi bi-shield-lock me-2"></i>

              Password reset links are
              temporary and single-use.

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ForgotPassword;