
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  /* ========================================
     LOAD ALERTS
  ======================================== */

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      /*
        Admin endpoint:
        GET /api/admin/alerts
      */

      const response =
        await api.get(
          "/admin/alerts"
        );

      setAlerts(
        response.data?.data?.alerts ||
          []
      );

    } catch (error) {
      console.error(
        "Admin alerts failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load emergency alerts."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  /* ========================================
     STATUS CLASS
  ======================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-bg-danger";

      case "ACKNOWLEDGED":
        return "text-bg-warning";

      case "RESOLVED":
        return "text-bg-success";

      case "CANCELLED":
        return "text-bg-secondary";

      default:
        return "text-bg-dark";
    }
  };

  /* ========================================
     FORMAT DATE
  ======================================== */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleString();
  };

  /* ========================================
     LOCATION
  ======================================== */

  const getLocation = (alert) => {
    const location =
      alert.latestLocation ||
      alert.initialLocation;

    if (!location) {
      return "Location unavailable";
    }

    return `${Number(
      location.latitude
    ).toFixed(5)}, ${Number(
      location.longitude
    ).toFixed(5)}`;
  };

  /* ========================================
     OPEN MAP
  ======================================== */

  const openMap = (alert) => {
    const location =
      alert.latestLocation ||
      alert.initialLocation;

    if (!location) {
      return;
    }

    const url =
      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <DashboardLayout>

        <div className="text-center py-5">

          <div className="spinner-border text-danger"></div>

          <p className="text-muted mt-3">
            Loading emergency alerts...
          </p>

        </div>

      </DashboardLayout>
    );
  }

  /* ========================================
     ERROR
  ======================================== */

  if (error) {
    return (
      <DashboardLayout>

        <div className="alert alert-danger">

          <i className="bi bi-exclamation-triangle me-2"></i>

          {error}

          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadAlerts}
          >
            Retry
          </button>

        </div>

      </DashboardLayout>
    );
  }

  const activeCount =
    alerts.filter(
      (alert) =>
        alert.status === "ACTIVE" ||
        alert.status ===
          "ACKNOWLEDGED"
    ).length;

  return (
    <DashboardLayout>

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="dashboard-welcome mb-4">

        <div>

          <p className="welcome-label">
            ADMIN CONTROL CENTER
          </p>

          <h1>
            Emergency Alerts
          </h1>

          <p>
            Monitor Silent SOS alerts
            from registered users.
          </p>

        </div>

        <div className="safety-badge">

          <i className="bi bi-broadcast"></i>

          <div>

            <strong>
              Emergency Activity
            </strong>

            <span>
              {activeCount} active alerts
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          ACTIVE ALERT WARNING
      ======================================== */}

      {activeCount > 0 && (

        <div className="alert alert-danger d-flex align-items-center mb-4">

          <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>

          <div>

            <strong>
              Active Emergency Detected
            </strong>

            <div>
              {activeCount} emergency alert
              {activeCount > 1 ? "s are" : " is"}{" "}
              currently active.
              Immediate attention may be required.
            </div>

          </div>

        </div>

      )}


      {/* ========================================
          ALERT SUMMARY
      ======================================== */}

      <div className="row g-4 mb-4">

        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                TOTAL ALERTS
              </small>

              <h2 className="mt-2 mb-0">
                {alerts.length}
              </h2>

              <p className="text-muted mb-0 mt-2">
                All emergency records
              </p>

            </div>

          </div>

        </div>


        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                ACTIVE
              </small>

              <h2 className="mt-2 mb-0 text-danger">
                {activeCount}
              </h2>

              <p className="text-danger mb-0 mt-2">
                Requires attention
              </p>

            </div>

          </div>

        </div>


        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                RESOLVED
              </small>

              <h2 className="mt-2 mb-0 text-success">

                {
                  alerts.filter(
                    (alert) =>
                      alert.status ===
                      "RESOLVED"
                  ).length
                }

              </h2>

              <p className="text-success mb-0 mt-2">
                Successfully resolved
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          ALERT TABLE
      ======================================== */}

      <section className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div>

              <p className="welcome-label mb-2">
                EMERGENCY ACTIVITY
              </p>

              <h3 className="mb-1">
                SOS Alerts
              </h3>

              <p className="text-muted mb-0">
                Complete emergency alert history.
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={loadAlerts}
            >

              <i className="bi bi-arrow-clockwise me-2"></i>

              Refresh Alerts

            </button>

          </div>


          {alerts.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-shield-check fs-1 text-success"></i>

              <h5 className="mt-3">
                No emergency alerts
              </h5>

              <p className="text-muted mb-0">
                There are currently no alert records.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>
                      Alert
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Triggered
                    </th>

                    <th className="text-end">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {alerts.map(
                    (alert) => {

                      const user =
                        alert.user || {};

                      const location =
                        alert.latestLocation ||
                        alert.initialLocation;

                      const isActive =
                        alert.status ===
                          "ACTIVE" ||
                        alert.status ===
                          "ACKNOWLEDGED";

                      return (

                        <tr
                          key={
                            alert._id
                          }
                          className={
                            isActive
                              ? "table-danger"
                              : ""
                          }
                        >

                          {/* ALERT */}

                          <td>

                            <div className="d-flex align-items-center gap-2">

                              {isActive && (

                                <span
                                  className="d-inline-block rounded-circle bg-danger"
                                  style={{
                                    width: "9px",
                                    height: "9px",
                                  }}
                                ></span>

                              )}

                              <div>

                                <strong>
                                  {alert.alertCode ||
                                    "Unknown Alert"}
                                </strong>

                                <div className="small text-muted">

                                  {alert.triggerType ||
                                    "SILENT_SOS"}

                                </div>

                              </div>

                            </div>

                          </td>


                          {/* USER */}

                          <td>

                            <strong>
                              {user.name ||
                                "Unknown User"}
                            </strong>

                            <div className="small text-muted">
                              {user.email ||
                                "—"}
                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`badge ${getStatusClass(
                                alert.status
                              )}`}
                            >

                              {alert.status}

                            </span>

                          </td>


                          {/* LOCATION */}

                          <td>

                            {location ? (

                              <>

                                <div className="fw-semibold">

                                  {getLocation(
                                    alert
                                  )}

                                </div>

                                <div className="small text-muted">

                                  Accuracy:{" "}

                                  {location.accuracy !=
                                  null
                                    ? `${location.accuracy} m`
                                    : "—"}

                                </div>

                              </>

                            ) : (

                              <span className="text-muted">
                                Unavailable
                              </span>

                            )}

                          </td>


                          {/* TRIGGERED */}

                          <td>

                            {formatDate(
                              alert.triggeredAt
                            )}

                          </td>


                          {/* ACTION */}

                          <td className="text-end">

                            <div className="d-flex justify-content-end gap-2">

                              {location && (

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    openMap(
                                      alert
                                    )
                                  }
                                  title="Open location"
                                >

                                  <i className="bi bi-geo-alt"></i>

                                </button>

                              )}

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() =>
                                  navigate(
                                    `/admin/alerts/${alert._id}`
                                  )
                                }
                              >

                                <i className="bi bi-eye me-1"></i>

                                View

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>

    </DashboardLayout>
  );
}

export default AdminAlerts;
