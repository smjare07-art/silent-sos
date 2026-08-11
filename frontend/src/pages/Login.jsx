
import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  loginUser,
} from "../services/authService";

import "../styles/auth.css";

function Login() {
  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [searchParams] =
    useSearchParams();

  const passwordResetSuccess =
    searchParams.get("reset") ===
    "success";

  const sessionExpired =
    searchParams.get("session") ===
    "expired";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        const response =
          await loginUser({
            email: email
              .trim()
              .toLowerCase(),

            password,
          });

        /*
          Backend login response
          should contain:

          {
            user: {
              ...
              role: "user" / "admin"
            }
          }
        */

        const user =
          response.data?.user;
          console.log(
  "LOGIN RESPONSE:",
  response.data
);

console.log(
  "LOGGED IN USER:",
  user
);

console.log(
  "USER ROLE:",
  user?.role
);

        if (!user) {
          throw new Error(
            "Invalid login response from server."
          );
        }

        /*
          Save complete user object
          inside AuthContext.
        */

        login(user);

        /*
          ROLE BASED REDIRECT

          Admin -> /admin
          User  -> /dashboard
        */

        if (user.role === "admin") {
          navigate(
            "/admin",
            {
              replace: true,
            }
          );

          return;
        }

        /*
          Normal users.

          If ProtectedRoute sent the
          user to login, return them
          to their original page.

          Otherwise go to dashboard.
        */

        const destination =
          location.state?.from
            ?.pathname ||
          "/dashboard";

        navigate(
          destination,
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          "Login failed:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Unable to sign in. Please try again."
        );
      } finally {
        setIsSubmitting(false);
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

                <i className="bi bi-shield-fill-check"></i>

              </div>

              <h1 className="auth-brand">
                Silent SOS
              </h1>

              <p className="text-muted mb-0">
                Your safety. One silent
                action away.
              </p>

            </div>

            {/* Login Card */}

            <div className="auth-card">

              <div className="mb-4">

                <h2 className="auth-title">
                  Welcome back
                </h2>

                <p className="text-muted mb-0">
                  Sign in to access your
                  safety dashboard.
                </p>

              </div>

              {/* Session Expired */}

              {sessionExpired && (
                <div
                  className="alert alert-warning"
                  role="alert"
                >
                  <i className="bi bi-clock-history me-2"></i>

                  Your session expired.
                  Please sign in again.
                </div>
              )}

              {/* Password Reset Success */}

              {passwordResetSuccess && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>

                  Password reset successfully.
                  Sign in with your new password.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
              >

                {/* Email */}

                <div className="mb-3">

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
                      onChange={(e) => {
                        setEmail(
                          e.target.value
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

                {/* Password */}

                <div className="mb-2">

                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                  >
                    Password
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(
                          e.target.value
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
                          (previous) =>
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

                {/* Forgot Password */}

                <div className="d-flex justify-content-end mb-4">

                  <Link
                    to="/forgot-password"
                    className="auth-link"
                  >
                    Forgot password?
                  </Link>

                </div>

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

                {/* Login */}

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

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}

                </button>

              </form>

              {/* Register */}

              <div className="auth-divider">

                <span>
                  New to Silent SOS?
                </span>

              </div>

              <Link
                to="/register"
                className="btn btn-outline-dark w-100 auth-secondary-btn"
              >
                Create an account
              </Link>

            </div>

            {/* Security */}

            <div className="auth-security text-center mt-4">

              <i className="bi bi-shield-lock me-2"></i>

              Your information is securely
              protected

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;
