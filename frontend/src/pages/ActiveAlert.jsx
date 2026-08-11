import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import LocationMap from "../components/LocationMap";

import {
  cancelAlert,
  getActiveAlert,
  getAlertNotifications,
  resolveAlert,
  updateAlertLocation,
} from "../services/alertService";

import "../styles/activeAlert.css";

function ActiveAlert() {
  const navigate =
    useNavigate();

  /* ========================================
     STATE
  ======================================== */

  const [alert, setAlert] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const [trackingError, setTrackingError] =
    useState("");

  /* ========================================
     REFS
  ======================================== */

  const watchIdRef =
    useRef(null);

  const lastSentRef =
    useRef(0);

  const locationRequestRef =
    useRef(false);

  /* ========================================
     LOAD NOTIFICATIONS
  ======================================== */

  const loadNotifications =
    useCallback(
      async (alertId) => {
        if (!alertId) {
          return;
        }

        try {
          setNotificationsLoading(
            true
          );

          const response =
            await getAlertNotifications(
              alertId
            );

          setNotifications(
            response.data
              ?.notifications || []
          );
        } catch (error) {
          console.error(
            "Unable to load notification status:",
            error
          );

          setNotifications([]);
        } finally {
          setNotificationsLoading(
            false
          );
        }
      },
      []
    );

  /* ========================================
     LOAD ACTIVE ALERT
  ======================================== */

  const loadAlert =
    useCallback(async () => {
      try {
        setError("");

        const response =
          await getActiveAlert();

        const activeAlert =
          response.data?.alert ||
          null;

        setAlert(activeAlert);

        if (
          activeAlert?._id
        ) {
          await loadNotifications(
            activeAlert._id
          );
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error(
          "Unable to load active alert:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to load active alert."
        );

        setAlert(null);
      } finally {
        setLoading(false);
      }
    }, [loadNotifications]);

  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {
    loadAlert();
  }, [loadAlert]);

  /* ========================================
     LIVE LOCATION TRACKING
  ======================================== */

  useEffect(() => {
    if (!alert?._id) {
      return;
    }

    /*
      Browser does not support
      geolocation.
    */

    if (
      !navigator.geolocation
    ) {
      setTrackingError(
        "Live location tracking is not supported by this browser."
      );

      return;
    }

    /*
      Prevent duplicate watchers.
    */

    if (
      watchIdRef.current !==
      null
    ) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current =
        null;
    }

    setTrackingError("");

    /*
      Start continuous GPS tracking.
    */

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        async (position) => {
          const now =
            Date.now();

          /*
            Send maximum one backend
            update every 10 seconds.
          */

          if (
            now -
              lastSentRef.current <
            10000
          ) {
            return;
          }

          /*
            Prevent overlapping
            location API requests.
          */

          if (
            locationRequestRef.current
          ) {
            return;
          }

          lastSentRef.current =
            now;

          const location = {
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

          /*
            Update UI immediately.
          */

          setAlert(
            (previous) => {
              if (!previous) {
                return previous;
              }

              return {
                ...previous,

                latestLocation:
                  location,
              };
            }
          );

          try {
            locationRequestRef.current =
              true;

            await updateAlertLocation(
              alert._id,
              location
            );

            setTrackingError("");
          } catch (error) {
            console.error(
              "Location update failed:",
              error
            );

            /*
              Do not replace main alert
              error for temporary GPS/API
              update failures.
            */

            setTrackingError(
              error.response?.data
                ?.message ||
                "Live location could not be updated."
            );
          } finally {
            locationRequestRef.current =
              false;
          }
        },

        (geoError) => {
          console.error(
            "Location tracking error:",
            geoError
          );

          switch (
            geoError.code
          ) {
            case 1:
              setTrackingError(
                "Location permission was denied. Enable location access to continue live tracking."
              );
              break;

            case 2:
              setTrackingError(
                "Your current location is temporarily unavailable."
              );
              break;

            case 3:
              setTrackingError(
                "Location request timed out. Tracking will continue trying."
              );
              break;

            default:
              setTrackingError(
                "Unable to track your live location."
              );
          }
        },

        {
          enableHighAccuracy:
            true,

          timeout:
            15000,

          maximumAge:
            5000,
        }
      );

    /*
      Cleanup watcher when leaving
      page or when alert changes.
    */

    return () => {
      if (
        watchIdRef.current !==
        null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current =
          null;
      }

      locationRequestRef.current =
        false;
    };
  }, [alert?._id]);

  /* ========================================
     RESOLVE ALERT
  ======================================== */

  const handleResolve =
    async () => {
      if (
        !alert ||
        processing
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure the emergency situation is resolved?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessing(true);
        setError("");

        await resolveAlert(
          alert._id
        );

        /*
          Stop GPS immediately.
        */

        if (
          watchIdRef.current !==
          null
        ) {
          navigator.geolocation.clearWatch(
            watchIdRef.current
          );

          watchIdRef.current =
            null;
        }

        navigate(
          "/alert-history",
          {
            replace: true,
          }
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to resolve alert."
        );
      } finally {
        setProcessing(false);
      }
    };

  /* ========================================
     CANCEL ACCIDENTAL ALERT
  ======================================== */

  const handleCancel =
    async () => {
      if (
        !alert ||
        processing
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Cancel this SOS alert? Use this only if it was activated accidentally."
        );

      if (!confirmed) {
        return;
      }

      try {
        setProcessing(true);
        setError("");

        await cancelAlert(
          alert._id
        );

        /*
          Stop GPS immediately.
        */

        if (
          watchIdRef.current !==
          null
        ) {
          navigator.geolocation.clearWatch(
            watchIdRef.current
          );

          watchIdRef.current =
            null;
        }

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to cancel alert."
        );
      } finally {
        setProcessing(false);
      }
    };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <DashboardLayout>

        <div className="active-alert-loading">

          <div className="spinner-border text-danger"></div>

          <p>
            Checking emergency status...
          </p>

        </div>

      </DashboardLayout>
    );
  }

  /* ========================================
     NO ACTIVE ALERT
  ======================================== */

  if (!alert) {
    return (
      <DashboardLayout>

        <section className="no-active-alert">

          <div className="no-alert-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <h1>
            No Active Emergency
          </h1>

          <p>
            You currently have no active
            Silent SOS alert.
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <button
            type="button"
            className="btn btn-dark"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Return to Dashboard
          </button>

        </section>

      </DashboardLayout>
    );
  }

  const location =
    alert.latestLocation;

  /* ========================================
     PAGE
  ======================================== */

  return (
    <DashboardLayout>

      {/* Emergency Banner */}

      <section className="emergency-banner">

        <div className="emergency-live-dot"></div>

        <div>
          <span>
            EMERGENCY ALERT ACTIVE
          </span>

          <strong>
            Silent SOS is currently active
          </strong>
        </div>

      </section>

      {/* Main API Error */}

      {error && (
        <div className="alert alert-danger mt-3">
          <i className="bi bi-exclamation-circle me-2"></i>

          {error}
        </div>
      )}

      {/* GPS Warning */}

      {trackingError && (
        <div className="alert alert-warning mt-3">
          <i className="bi bi-geo-alt me-2"></i>

          {trackingError}
        </div>
      )}

      <div className="row g-4 mt-1">

        {/* ==================================
            INCIDENT DETAILS
        ================================== */}

        <div className="col-12 col-xl-4">

          <section className="active-alert-card">

            <span className="section-eyebrow">
              ACTIVE INCIDENT
            </span>

            <h1>
              Emergency Alert
            </h1>

            <div className="alert-code">

              <span>
                Alert ID
              </span>

              <strong>
                {alert.alertCode}
              </strong>

            </div>

            <div className="alert-detail">

              <span>
                Status
              </span>

              <strong className="active-status">

                <i className="bi bi-broadcast"></i>

                {alert.status}

              </strong>

            </div>

            <div className="alert-detail">

              <span>
                Triggered
              </span>

              <strong>
                {alert.triggeredAt
                  ? new Date(
                      alert.triggeredAt
                    ).toLocaleString()
                  : "Unknown"}
              </strong>

            </div>

            <div className="alert-detail">

              <span>
                GPS Accuracy
              </span>

              <strong>
                {location?.accuracy !==
                null &&
                location?.accuracy !==
                undefined
                  ? `±${Math.round(
                      location.accuracy
                    )} m`
                  : "Unknown"}
              </strong>

            </div>

            {/* Live Indicator */}

            <div className="live-tracking-indicator">

              <span></span>

              Live location tracking

            </div>

            {/* Resolve */}

            <button
              type="button"
              className="btn btn-success w-100 mt-4"
              disabled={
                processing
              }
              onClick={
                handleResolve
              }
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>

                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>

                  Mark Emergency Resolved
                </>
              )}
            </button>

            {/* Cancel */}

            {alert.status ===
              "ACTIVE" && (
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-2"
                disabled={
                  processing
                }
                onClick={
                  handleCancel
                }
              >
                Cancel Accidental Alert
              </button>
            )}

          </section>

        </div>

        {/* ==================================
            LIVE MAP
        ================================== */}

        <div className="col-12 col-xl-8">

          <section className="active-map-card">

            <div className="active-map-heading">

              <div>

                <span className="section-eyebrow">
                  LIVE LOCATION
                </span>

                <h2>
                  Current Position
                </h2>

              </div>

              <span className="map-live-badge">

                <span></span>

                LIVE

              </span>

            </div>

            {location ? (
              <LocationMap
                latitude={
                  location.latitude
                }
                longitude={
                  location.longitude
                }
                accuracy={
                  location.accuracy
                }
              />
            ) : (
              <div className="alert alert-warning m-3">
                Current location is unavailable.
              </div>
            )}

          </section>

        </div>

      </div>

      {/* ====================================
          CONTACT SNAPSHOT
      ==================================== */}

      {alert.contactsSnapshot?.length >
        0 && (
        <section className="notification-status-card mt-4">

          <div className="notification-status-heading">

            <div>

              <span className="section-eyebrow">
                SAFETY NETWORK
              </span>

              <h2>
                Emergency Contacts
              </h2>

              <p>
                Contacts associated with this
                emergency when the SOS was
                activated.
              </p>

            </div>

          </div>

          <div className="notification-list">

            {alert.contactsSnapshot.map(
              (
                contact,
                index
              ) => (
                <article
                  className="notification-item"
                  key={
                    contact.contactId ||
                    `${contact.phone}-${index}`
                  }
                >

                  <div className="notification-channel sent">
                    <i className="bi bi-person-fill"></i>
                  </div>

                  <div className="notification-person">

                    <strong>
                      {contact.name}
                    </strong>

                    <span>
                      {contact.relationship ||
                        "Emergency Contact"}
                    </span>

                  </div>

                  <div className="notification-type">
                    {contact.isPrimary
                      ? "PRIMARY"
                      : "CONTACT"}
                  </div>

                  <span className="notification-status sent">
                    <i className="bi bi-telephone-fill"></i>

                    {contact.phone}
                  </span>

                </article>
              )
            )}

          </div>

        </section>
      )}

      {/* ====================================
          NOTIFICATION DELIVERY STATUS
      ==================================== */}

      <section className="notification-status-card mt-4">

        <div className="notification-status-heading">

          <div>

            <span className="section-eyebrow">
              EMERGENCY NOTIFICATIONS
            </span>

            <h2>
              Contact Notification Status
            </h2>

            <p>
              Delivery status for emergency
              notifications associated with
              this alert.
            </p>

          </div>

          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() =>
              loadNotifications(
                alert._id
              )
            }
            disabled={
              notificationsLoading
            }
          >
            <i className="bi bi-arrow-clockwise me-1"></i>

            Refresh
          </button>

        </div>

        {notificationsLoading ? (

          <div className="notification-loading">

            <div className="spinner-border spinner-border-sm text-danger"></div>

            Checking delivery status...

          </div>

        ) : notifications.length ===
          0 ? (

          <div className="notification-empty">

            <i className="bi bi-envelope-exclamation"></i>

            <div>

              <strong>
                No notification records
              </strong>

              <span>
                No contact notification status
                is currently available.
              </span>

            </div>

          </div>

        ) : (

          <div className="notification-list">

            {notifications.map(
              (notification) => {

                const status =
                  notification.status ||
                  "PENDING";

                const statusClass =
                  status.toLowerCase();

                return (
                  <article
                    className="notification-item"
                    key={
                      notification._id
                    }
                  >

                    {/* Channel */}

                    <div
                      className={`notification-channel ${statusClass}`}
                    >
                      <i
                        className={
                          notification.channel ===
                          "EMAIL"
                            ? "bi bi-envelope"
                            : "bi bi-chat-dots"
                        }
                      ></i>
                    </div>

                    {/* Recipient */}

                    <div className="notification-person">

                      <strong>
                        {notification.recipientName ||
                          "Emergency Contact"}
                      </strong>

                      <span>
                        {notification.recipient ||
                          "—"}
                      </span>

                    </div>

                    {/* Type */}

                    <div className="notification-type">
                      {notification.channel ||
                        "UNKNOWN"}
                    </div>

                    {/* Status */}

                    <span
                      className={`notification-status ${statusClass}`}
                    >

                      {status ===
                        "SENT" && (
                        <i className="bi bi-check-circle-fill"></i>
                      )}

                      {status ===
                        "FAILED" && (
                        <i className="bi bi-x-circle-fill"></i>
                      )}

                      {status ===
                        "SKIPPED" && (
                        <i className="bi bi-dash-circle-fill"></i>
                      )}

                      {status ===
                        "PENDING" && (
                        <i className="bi bi-clock-fill"></i>
                      )}

                      {status}

                    </span>

                    {/* Time */}

                    <div className="notification-time">

                      {notification.sentAt
                        ? new Date(
                            notification.sentAt
                          ).toLocaleTimeString()
                        : "—"}

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* ====================================
          SAFETY NOTICE
      ==================================== */}

      <div className="emergency-notice mt-4">

        <i className="bi bi-exclamation-triangle"></i>

        <div>

          <strong>
            Emergency Safety Notice
          </strong>

          <p>
            This prototype does not replace
            official emergency services. If
            you can safely contact emergency
            services directly, do so.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ActiveAlert;