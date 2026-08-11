import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const { register } = useAuth();
const navigate = useNavigate();

const [serverError, setServerError] =
  useState("");

const [isSubmitting, setIsSubmitting] =
  useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain an uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain a lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain a number.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      newErrors.terms =
        "You must accept the Terms and Privacy Policy.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setServerError("");

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    navigate("/dashboard", {
      replace: true,
    });
  } catch (error) {
    const response = error.response?.data;

    if (
      response?.errors &&
      Array.isArray(response.errors)
    ) {
      const backendErrors = {};

      response.errors.forEach((item) => {
        backendErrors[item.field] =
          item.message;
      });

      setErrors((prev) => ({
        ...prev,
        ...backendErrors,
      }));
    } else {
      setServerError(
        response?.message ||
          "Unable to create your account. Please try again."
      );
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="auth-page">
      <div className="container">
        <div className="row justify-content-center py-5">
          <div className="col-12 col-sm-11 col-md-8 col-lg-6 col-xl-5">

            <div className="text-center mb-4">
              <div className="auth-logo mx-auto mb-3">
                <i className="bi bi-shield-fill-check"></i>
              </div>

              <h1 className="auth-brand">Silent SOS</h1>

              <p className="text-muted">
                Create your personal safety account
              </p>
            </div>

            <div className="auth-card">

              <div className="mb-4">
                <h2 className="auth-title">
                  Create account
                </h2>

                <p className="text-muted mb-0">
                  Set up your account before configuring
                  trusted emergency contacts.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Full Name */}

                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label fw-semibold"
                  >
                    Full Name
                  </label>

                  <div className="input-group auth-input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>

                  {errors.name && (
                    <div className="text-danger small mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Email */}

                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                  >
                    Email Address
                  </label>

                  <div className="input-group auth-input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>

                  {errors.email && (
                    <div className="text-danger small mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone */}

                <div className="mb-3">
                  <label
                    htmlFor="phone"
                    className="form-label fw-semibold"
                  >
                    Mobile Number
                  </label>

                  <div className="input-group auth-input-group">
                    <span className="input-group-text">
                      +91
                    </span>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>

                  {errors.phone && (
                    <div className="text-danger small mt-1">
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Password */}

                <div className="mb-3">
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
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="input-group-text password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
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

                  {errors.password && (
                    <div className="text-danger small mt-1">
                      {errors.password}
                    </div>
                  )}

                  <div className="form-text">
                    Minimum 8 characters with uppercase,
                    lowercase and a number.
                  </div>
                </div>

                {/* Confirm Password */}

                <div className="mb-3">
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
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      className={`form-control ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="input-group-text password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
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

                  {errors.confirmPassword && (
                    <div className="text-danger small mt-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Terms */}

                <div className="form-check mb-1">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.terms}
                    onChange={handleChange}
                  />

                  <label
                    htmlFor="terms"
                    className="form-check-label small"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="auth-link"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="auth-link"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {errors.terms && (
                  <div className="text-danger small mb-3">
                    {errors.terms}
                  </div>
                )}

                {!errors.terms && <div className="mb-3" />}
{serverError && (
  <div
    className="alert alert-danger"
    role="alert"
  >
    <i className="bi bi-exclamation-circle me-2"></i>

    {serverError}
  </div>
)}
               <button
  type="submit"
  className="btn btn-sos w-100"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        aria-hidden="true"
      ></span>

      Creating account...
    </>
  ) : (
    <>
      Create Account
      <i className="bi bi-arrow-right ms-2"></i>
    </>
  )}
</button>

              </form>

              <div className="auth-divider">
                <span>Already registered?</span>
              </div>

              <Link
                to="/login"
                className="btn btn-outline-dark w-100 auth-secondary-btn"
              >
                Sign In
              </Link>

            </div>

            <div className="auth-security text-center mt-4">
              <i className="bi bi-shield-lock me-2"></i>
              Your personal and emergency information
              should be handled securely.
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;