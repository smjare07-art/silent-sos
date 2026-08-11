import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import DashboardLayout from "../layouts/DashboardLayout";
import SOSButton from "../components/SOSButton";

import {
  getContacts,
} from "../services/contactService";

import {
  createAlert,
  getActiveAlert,
} from "../services/alertService";

import "../styles/dashboardHome.css";

function Dashboard() {
  const { user } =
    useAuth();

  const navigate =
    useNavigate();

  /* ========================================
     STATE
  ======================================== */

  const [
    contactCount,
    setContactCount,
  ] = useState(0);

  const [
    locationPermission,
    setLocationPermission,
  ] = useState("unknown");

  const [
    activeAlert,
    setActiveAlert,
  ] = useState(null);

  const [
    readinessLoading,
    setReadinessLoading,
  ] = useState(true);

  const [
    activatingSOS,
    setActivatingSOS,
  ] = useState(false);

  const [
    sosError,
    setSosError,
  ] = useState("");

  /* ========================================
     DERIVED STATUS
  ======================================== */

  const hasContacts =
    contactCount > 0;

  const hasActiveAlert =
    Boolean(activeAlert);

  const locationBlocked =
    locationPermission ===
    "denied";

  /*
    "prompt" is still acceptable.

    Browser can ask for permission
    when SOS is activated.
  */

  const systemReady =
    hasContacts &&
    !locationBlocked &&
    !hasActiveAlert;

  /*
    Prevent SOS when:

    - readiness is loading
    - request is already processing
    - no contacts exist
    - location is explicitly blocked
    - emergency already exists
  */

  const sosDisabled =
    readinessLoading ||
    activatingSOS ||
    !hasContacts ||
    locationBlocked ||
    hasActiveAlert;

  /* ========================================
     LOAD DASHBOARD READINESS
  ======================================== */

  const loadReadiness =
    useCallback(async () => {
      try {
        setReadinessLoading(
          true
        );

        const [
          contactsResponse,
          alertResponse,
        ] =
          await Promise.all([
            getContacts(),
            getActiveAlert(),
          ]);

        setContactCount(
          contactsResponse.data
            ?.count || 0
        );

        setActiveAlert(
          alertResponse.data
            ?.alert || null
        );
      } catch (error) {
        console.error(
          "Dashboard readiness failed:",
          error
        );
      } finally {
        setReadinessLoading(
          false
        );
      }
    }, []);

  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {
    loadReadiness();
  }, [loadReadiness]);

  /* ========================================
     GEOLOCATION PERMISSION STATUS
  ======================================== */

  useEffect(() => {
    let permissionStatus =
      null;

    let mounted = true;

    const checkPermission =
      async () => {
        /*
          Permissions API is not
          available in every browser.
        */

        if (
          !navigator.permissions ||
          !navigator.permissions.query
        ) {
          if (mounted) {
            setLocationPermission(
              "unknown"
            );
          }

          return;
        }

        try {
          permissionStatus =
            await navigator.permissions.query(
              {
                name:
                  "geolocation",
              }
            );

          if (!mounted) {
            return;
          }

          setLocationPermission(
            permissionStatus.state
          );

          permissionStatus.onchange =
            () => {
              if (mounted) {
                setLocationPermission(
                  permissionStatus.state
                );
              }
            };
        } catch (error) {
          /*
            Safari and some browsers
            may not fully support
            geolocation permission query.
          */

          if (mounted) {
            setLocationPermission(
              "unknown"
            );
          }
        }
      };

    checkPermission();

    return () => {
      mounted = false;

      if (permissionStatus) {
        permissionStatus.onchange =
          null;
      }
    };
  }, []);

  /* ========================================
     ACTIVATE SILENT SOS
  ======================================== */

  const activateSOS =
    useCallback(() => {
      /*
        Prevent duplicate activation.
      */

      if (
        activatingSOS
      ) {
        return;
      }

      setSosError("");

      /*
        Existing emergency.
      */

      if (hasActiveAlert) {
        navigate(
          "/active-alert"
        );

        return;
      }

      /*
        User must configure at least
        one trusted contact.
      */

      if (!hasContacts) {
        setSosError(
          "Add at least one emergency contact before activating SOS."
        );

        return;
      }

      /*
        Browser must support
        geolocation.
      */

      if (
        !navigator.geolocation
      ) {
        setSosError(
          "Location services are not supported by this browser."
        );

        return;
      }

      /*
        Permission already known
        to be blocked.
      */

      if (
        locationPermission ===
        "denied"
      ) {
        setSosError(
          "Location access is blocked. Enable location permission in your browser settings before activating SOS."
        );

        return;
      }

      setActivatingSOS(
        true
      );

      /*
        Request current position.

        If permission state is
        "prompt", this will trigger
        the browser permission dialog.
      */

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const alertLocation = {
              latitude:
                position.coords
                  .latitude,

              longitude:
                position.coords
                  .longitude,

              accuracy:
                position.coords
                  .accuracy,

              timestamp:
                new Date(
                  position.timestamp
                ).toISOString(),
            };

            const response =
              await createAlert(
                alertLocation
              );

            const createdAlert =
              response.data
                ?.alert;

            /*
              Store locally before
              navigation so dashboard
              state also reflects it.
            */

            if (createdAlert) {
              setActiveAlert(
                createdAlert
              );
            }

            navigate(
              "/active-alert",
              {
                replace: true,
              }
            );
          } catch (error) {
            console.error(
              "SOS activation failed:",
              error
            );

            /*
              Backend says an active
              emergency already exists.

              Safest action is to open
              that alert instead of
              showing an error.
            */

            if (
              error.response
                ?.status === 409 &&
              error.response
                ?.data?.data
                ?.alert
            ) {
              setActiveAlert(
                error.response.data
                  .data.alert
              );

              navigate(
                "/active-alert",
                {
                  replace: true,
                }
              );

              return;
            }

            setSosError(
              error.response?.data
                ?.message ||
                "Unable to activate SOS. Please try again."
            );
          } finally {
            setActivatingSOS(
              false
            );
          }
        },

        (geoError) => {
          console.error(
            "SOS location error:",
            geoError
          );

          let message =
            "Unable to get your current location.";

          switch (
            geoError.code
          ) {
            case 1:
              message =
                "Location permission is required before SOS can be activated.";

              setLocationPermission(
                "denied"
              );

              break;

            case 2:
              message =
                "Your current location is unavailable. Check GPS or location services and try again.";

              break;

            case 3:
              message =
                "Location request timed out. Please try again.";

              break;

            default:
              message =
                "Unable to access your current location.";
          }

          setSosError(
            message
          );

          setActivatingSOS(
            false
          );
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            15000,

          maximumAge:
            0,
        }
      );
    }, [
      activatingSOS,
      hasActiveAlert,
      hasContacts,
      locationPermission,
      navigate,
    ]);

  /* ========================================
     SOS STATUS TEXT
  ======================================== */

  const getSOSStatus = () => {
    if (
      readinessLoading
    ) {
      return {
        label:
          "Checking",
        className:
          "",
      };
    }

    if (
      hasActiveAlert
    ) {
      return {
        label:
          "Active",
        className:
          "danger",
      };
    }

    if (
      !hasContacts
    ) {
      return {
        label:
          "Setup Required",
        className:
          "warning",
      };
    }

    if (
      locationBlocked
    ) {
      return {
        label:
          "Location Blocked",
        className:
          "warning",
      };
    }

    return {
      label:
        "Ready",
      className:
        "",
    };
  };

  const sosStatus =
    getSOSStatus();

  /* ========================================
     PAGE
  ======================================== */

  return (
    <DashboardLayout>

      {/* ==================================
          WELCOME
      ================================== */}

      <section className="dashboard-welcome">

        <div>

          <p className="welcome-label">
            PERSONAL SAFETY CENTER
          </p>

          <h1>
            Hello,{" "}
            {user?.name
              ?.split(" ")[0] ||
              "there"}
          </h1>

          <p>
            Keep your trusted contacts
            and location permissions up
            to date before an emergency.
          </p>

        </div>

        <div
          className={`safety-badge ${
            systemReady
              ? ""
              : "safety-warning"
          }`}
        >

          <i
            className={`bi ${
              systemReady
                ? "bi-shield-check"
                : "bi-shield-exclamation"
            }`}
          ></i>

          <div>

            <strong>
              {readinessLoading
                ? "Checking..."
                : hasActiveAlert
                ? "SOS Active"
                : systemReady
                ? "Ready"
                : "Setup Required"}
            </strong>

            <span>
              {hasActiveAlert
                ? "Emergency alert in progress"
                : systemReady
                ? "Safety system available"
                : "Review safety readiness"}
            </span>

          </div>

        </div>

      </section>

      {/* ==================================
          MAIN GRID
      ================================== */}

      <div className="row g-4 mt-1">

        {/* =================================
            SOS PANEL
        ================================= */}

        <div className="col-12 col-xl-7">

          <section className="sos-panel">

            <div className="sos-panel-header">

              <div>

                <span className="section-eyebrow">
                  EMERGENCY ACTION
                </span>

                <h2>
                  Silent SOS
                </h2>

              </div>

              <div
                className={`ready-indicator ${sosStatus.className}`}
              >
                <span></span>

                {sosStatus.label}
              </div>

            </div>

            <div className="sos-center">

              {hasActiveAlert ? (

                <>
                  <div className="mb-3 text-center">

                    <i
                      className="bi bi-broadcast text-danger"
                      style={{
                        fontSize:
                          "3rem",
                      }}
                    ></i>

                  </div>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      navigate(
                        "/active-alert"
                      )
                    }
                  >
                    <i className="bi bi-broadcast me-2"></i>

                    View Active Emergency
                  </button>
                </>

              ) : (

                <SOSButton
                  onActivate={
                    activateSOS
                  }
                  disabled={
                    sosDisabled
                  }
                />

              )}

              {/* Activating */}

              {activatingSOS && (
                <div className="mt-3 text-center text-muted small">

                  <span className="spinner-border spinner-border-sm me-2"></span>

                  Securing your location
                  and activating SOS...

                </div>
              )}

              {/* Error */}

              {sosError && (
                <div
                  className="alert alert-danger mt-3 w-100"
                  role="alert"
                >

                  <i className="bi bi-exclamation-triangle me-2"></i>

                  {sosError}

                </div>
              )}

              {/* No Contacts */}

              {!readinessLoading &&
                !hasContacts &&
                !hasActiveAlert && (
                <div className="alert alert-warning mt-3 w-100">

                  <i className="bi bi-people me-2"></i>

                  Add at least one trusted
                  emergency contact before
                  using Silent SOS.

                  <div className="mt-2">

                    <Link
                      to="/emergency-contacts"
                      className="alert-link"
                    >
                      Add emergency contact
                    </Link>

                  </div>

                </div>
              )}

              {/* Location Blocked */}

              {!readinessLoading &&
                locationBlocked &&
                hasContacts &&
                !hasActiveAlert && (
                <div className="alert alert-warning mt-3 w-100">

                  <i className="bi bi-geo-alt me-2"></i>

                  Location access is
                  blocked. Enable it before
                  activating SOS.

                  <div className="mt-2">

                    <Link
                      to="/location"
                      className="alert-link"
                    >
                      Check location settings
                    </Link>

                  </div>

                </div>
              )}

              <p className="sos-description">
                Press and hold for three
                seconds to silently activate
                your emergency alert and
                share your location with
                your configured safety
                network.
              </p>

              <div className="sos-notice">

                <i className="bi bi-info-circle"></i>

                <span>
                  No alert will be created
                  until the full SOS hold is
                  completed.
                </span>

              </div>

            </div>

          </section>

        </div>

        {/* =================================
            SAFETY READINESS
        ================================= */}

        <div className="col-12 col-xl-5">

          <section className="status-panel">

            <div className="panel-heading">

              <div>

                <span className="section-eyebrow">
                  SYSTEM STATUS
                </span>

                <h2>
                  Safety Readiness
                </h2>

              </div>

            </div>

            {/* Account */}

            <div className="readiness-item">

              <div className="readiness-icon success">
                <i className="bi bi-person-check"></i>
              </div>

              <div className="readiness-content">

                <strong>
                  Account
                </strong>

                <span>
                  Account active
                </span>

              </div>

              <i className="bi bi-check-circle-fill readiness-check"></i>

            </div>

            {/* Contacts */}

            <div className="readiness-item">

              <div
                className={`readiness-icon ${
                  hasContacts
                    ? "success"
                    : "warning"
                }`}
              >
                <i className="bi bi-people"></i>
              </div>

              <div className="readiness-content">

                <strong>
                  Emergency Contacts
                </strong>

                <span>
                  {readinessLoading
                    ? "Checking contacts..."
                    : hasContacts
                    ? `${contactCount} trusted ${
                        contactCount ===
                        1
                          ? "contact"
                          : "contacts"
                      } configured`
                    : "No trusted contacts configured"}
                </span>

              </div>

              {hasContacts ? (

                <i className="bi bi-check-circle-fill readiness-check"></i>

              ) : (

                <Link
                  to="/emergency-contacts"
                  className="readiness-action"
                >
                  Setup
                </Link>

              )}

            </div>

            {/* Location */}

            <div className="readiness-item">

              <div
                className={`readiness-icon ${
                  locationPermission ===
                  "granted"
                    ? "success"
                    : locationBlocked
                    ? "warning"
                    : "location"
                }`}
              >
                <i className="bi bi-geo-alt"></i>
              </div>

              <div className="readiness-content">

                <strong>
                  Location
                </strong>

                <span>
                  {locationPermission ===
                  "granted"
                    ? "Location permission granted"
                    : locationPermission ===
                      "denied"
                    ? "Location permission blocked"
                    : locationPermission ===
                      "prompt"
                    ? "Permission will be requested when needed"
                    : "Permission status unavailable"}
                </span>

              </div>

              {locationPermission ===
              "granted" ? (

                <i className="bi bi-check-circle-fill readiness-check"></i>

              ) : locationBlocked ? (

                <Link
                  to="/location"
                  className="readiness-action"
                >
                  Fix
                </Link>

              ) : (

                <Link
                  to="/location"
                  className="readiness-action"
                >
                  Check
                </Link>

              )}

            </div>

            {/* Emergency Status */}

            <div className="readiness-item">

              <div
                className={`readiness-icon ${
                  hasActiveAlert
                    ? "danger"
                    : "success"
                }`}
              >

                <i
                  className={`bi ${
                    hasActiveAlert
                      ? "bi-broadcast"
                      : "bi-shield-check"
                  }`}
                ></i>

              </div>

              <div className="readiness-content">

                <strong>
                  Emergency Status
                </strong>

                <span>
                  {hasActiveAlert
                    ? "Silent SOS is currently active"
                    : "No active emergency alert"}
                </span>

              </div>

              {hasActiveAlert ? (

                <Link
                  to="/active-alert"
                  className="readiness-action"
                >
                  View
                </Link>

              ) : (

                <i className="bi bi-check-circle-fill readiness-check"></i>

              )}

            </div>

          </section>

        </div>

      </div>

      {/* ==================================
          QUICK LINKS
      ================================== */}

      <div className="row g-4 mt-1">

        <div className="col-12 col-md-4">

          <Link
            to="/emergency-contacts"
            className="quick-card"
          >

            <div className="quick-icon contacts">
              <i className="bi bi-people"></i>
            </div>

            <div>

              <span>
                Emergency Contacts
              </span>

              <strong>
                Manage contacts
              </strong>

            </div>

            <i className="bi bi-chevron-right quick-arrow"></i>

          </Link>

        </div>

        <div className="col-12 col-md-4">

          <Link
            to="/alert-history"
            className="quick-card"
          >

            <div className="quick-icon history">
              <i className="bi bi-clock-history"></i>
            </div>

            <div>

              <span>
                Alert History
              </span>

              <strong>
                View activity
              </strong>

            </div>

            <i className="bi bi-chevron-right quick-arrow"></i>

          </Link>

        </div>

        <div className="col-12 col-md-4">

          <Link
            to="/profile"
            className="quick-card"
          >

            <div className="quick-icon profile">
              <i className="bi bi-person-gear"></i>
            </div>

            <div>

              <span>
                Safety Profile
              </span>

              <strong>
                Manage profile
              </strong>

            </div>

            <i className="bi bi-chevron-right quick-arrow"></i>

          </Link>

        </div>

      </div>

      {/* ==================================
          DISCLAIMER
      ================================== */}

      <div className="prototype-disclaimer mt-4">

        <i className="bi bi-info-circle"></i>

        <div>

          <strong>
            Safety Notice
          </strong>

          <p>
            Silent SOS is currently a
            safety-support prototype and
            does not replace official
            emergency services. In
            immediate danger, contact the
            appropriate emergency service
            whenever possible.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;