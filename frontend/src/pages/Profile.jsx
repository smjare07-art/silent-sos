import {
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  useAuth,
} from "../context/AuthContext";

function Profile() {
  const {
    user,
  } = useAuth();

  const [
    showDetails,
    setShowDetails,
  ] = useState(true);

  if (!user) {
    return null;
  }

  const formattedLastLogin =
    user.lastLogin
      ? new Date(
          user.lastLogin
        ).toLocaleString()
      : "Never";

  const accountStatus =
    user.isActive !== false
      ? "Active"
      : "Disabled";

  const verificationStatus =
    user.isEmailVerified
      ? "Verified"
      : "Not Verified";

  return (
    <DashboardLayout>

      {/* ========================================
          PROFILE HEADER
      ======================================== */}

      <section className="dashboard-welcome">

        <div>

          <p className="welcome-label">
            SAFETY PROFILE
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your account information
            and safety identity.
          </p>

        </div>

        <div className="safety-badge">

          <i className="bi bi-person-check"></i>

          <div>

            <strong>
              Account Secure
            </strong>

            <span>
              Your safety profile is active
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          PROFILE CARD
      ======================================== */}

      <section className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <div className="d-flex align-items-center gap-4 flex-wrap">

            {/* Avatar */}

            <div
              className="rounded-circle bg-danger text-white
                         d-flex align-items-center justify-content-center
                         fw-bold"
              style={{
                width: "90px",
                height: "90px",
                fontSize: "36px",
              }}
            >
              {user.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>


            {/* Name */}

            <div>

              <h2 className="mb-1">
                {user.name}
              </h2>

              <p className="text-muted mb-2">
                {user.email}
              </p>

              <span className="badge text-bg-primary">
                <i className="bi bi-person me-1"></i>
                Safety User
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          PERSONAL INFORMATION
      ======================================== */}

      <section className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <p className="welcome-label mb-2">
                PERSONAL INFORMATION
              </p>

              <h3 className="mb-0">
                Account Details
              </h3>

            </div>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() =>
                setShowDetails(
                  (previous) =>
                    !previous
                )
              }
            >
              <i
                className={`bi ${
                  showDetails
                    ? "bi-eye-slash"
                    : "bi-eye"
                } me-2`}
              ></i>

              {showDetails
                ? "Hide"
                : "Show"}
            </button>

          </div>


          {showDetails && (

            <div className="row g-4 mt-2">

              {/* Name */}

              <div className="col-12 col-md-6">

                <div className="border rounded-3 p-3 h-100">

                  <small className="text-muted">
                    FULL NAME
                  </small>

                  <div className="d-flex align-items-center gap-3 mt-2">

                    <i className="bi bi-person fs-4 text-primary"></i>

                    <strong>
                      {user.name || "Not available"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Email */}

              <div className="col-12 col-md-6">

                <div className="border rounded-3 p-3 h-100">

                  <small className="text-muted">
                    EMAIL ADDRESS
                  </small>

                  <div className="d-flex align-items-center gap-3 mt-2">

                    <i className="bi bi-envelope fs-4 text-primary"></i>

                    <strong>
                      {user.email || "Not available"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Phone */}

              <div className="col-12 col-md-6">

                <div className="border rounded-3 p-3 h-100">

                  <small className="text-muted">
                    PHONE NUMBER
                  </small>

                  <div className="d-flex align-items-center gap-3 mt-2">

                    <i className="bi bi-telephone fs-4 text-success"></i>

                    <strong>
                      {user.phone || "Not available"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Role */}

              <div className="col-12 col-md-6">

                <div className="border rounded-3 p-3 h-100">

                  <small className="text-muted">
                    ACCOUNT ROLE
                  </small>

                  <div className="d-flex align-items-center gap-3 mt-2">

                    <i className="bi bi-shield-check fs-4 text-danger"></i>

                    <strong>
                      {user.role === "admin"
                        ? "Administrator"
                        : "Safety User"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ========================================
          ACCOUNT STATUS
      ======================================== */}

      <section className="card border-0 shadow-sm mt-4">

        <div className="card-body">

          <p className="welcome-label mb-2">
            ACCOUNT STATUS
          </p>

          <h3>
            Security & Verification
          </h3>


          <div className="row g-4 mt-2">

            {/* Account */}

            <div className="col-12 col-md-4">

              <div className="border rounded-3 p-4 h-100">

                <i className="bi bi-check-circle-fill fs-2 text-success"></i>

                <small className="d-block text-muted mt-3">
                  ACCOUNT
                </small>

                <h5 className="mt-1 mb-0">
                  {accountStatus}
                </h5>

              </div>

            </div>


            {/* Email */}

            <div className="col-12 col-md-4">

              <div className="border rounded-3 p-4 h-100">

                <i
                  className={`bi ${
                    user.isEmailVerified
                      ? "bi-envelope-check-fill text-success"
                      : "bi-envelope-exclamation-fill text-warning"
                  } fs-2`}
                ></i>

                <small className="d-block text-muted mt-3">
                  EMAIL VERIFICATION
                </small>

                <h5 className="mt-1 mb-0">
                  {verificationStatus}
                </h5>

              </div>

            </div>


            {/* Last Login */}

            <div className="col-12 col-md-4">

              <div className="border rounded-3 p-4 h-100">

                <i className="bi bi-clock-history fs-2 text-primary"></i>

                <small className="d-block text-muted mt-3">
                  LAST LOGIN
                </small>

                <h6 className="mt-1 mb-0">
                  {formattedLastLogin}
                </h6>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          SAFETY INFORMATION
      ======================================== */}

      <section className="card border-0 shadow-sm mt-4 mb-4">

        <div className="card-body">

          <div className="d-flex align-items-start gap-3">

            <div className="fs-2 text-danger">
              <i className="bi bi-shield-lock-fill"></i>
            </div>

            <div>

              <h4>
                Safety & Privacy
              </h4>

              <p className="text-muted mb-0">
                Your Silent SOS account information
                is used to provide emergency safety
                features. Keep your account credentials
                private and make sure your emergency
                contacts remain up to date.
              </p>

            </div>

          </div>

        </div>

      </section>

    </DashboardLayout>
  );
}

export default Profile;