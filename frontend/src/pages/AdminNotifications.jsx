
import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function AdminNotifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ========================================
     LOAD NOTIFICATIONS
  ======================================== */

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/admin/notifications"
        );

      setNotifications(
        response.data?.data?.notifications ||
          []
      );
    } catch (error) {
      console.error(
        "Admin notifications failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ========================================
     STATUS
  ======================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "SENT":
        return "text-bg-success";

      case "FAILED":
        return "text-bg-danger";

      case "PENDING":
        return "text-bg-warning";

      default:
        return "text-bg-secondary";
    }
  };

  /* ========================================
     DATE
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
     LOADING
  ======================================== */

  if (loading) {
    return (
      <DashboardLayout>

        <div className="text-center py-5">

          <div className="spinner-border text-danger"></div>

          <p className="text-muted mt-3">
            Loading notifications...
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
            onClick={loadNotifications}
          >
            Retry
          </button>

        </div>

      </DashboardLayout>
    );
  }

  /* ========================================
     COUNTS
  ======================================== */

  const sentCount =
    notifications.filter(
      (item) =>
        item.status === "SENT"
    ).length;

  const failedCount =
    notifications.filter(
      (item) =>
        item.status === "FAILED"
    ).length;

  const pendingCount =
    notifications.filter(
      (item) =>
        item.status === "PENDING"
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
            Notifications
          </h1>

          <p>
            Monitor Silent SOS notification
            delivery activity.
          </p>

        </div>

        <div className="safety-badge">

          <i className="bi bi-bell"></i>

          <div>

            <strong>
              Notification Center
            </strong>

            <span>
              Delivery monitoring enabled
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          SUMMARY
      ======================================== */}

      <div className="row g-4 mb-4">

        {/* TOTAL */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                TOTAL NOTIFICATIONS
              </small>

              <h2 className="mt-2 mb-0">
                {notifications.length}
              </h2>

              <p className="text-muted mb-0 mt-2">
                All notification records
              </p>

            </div>

          </div>

        </div>


        {/* SENT */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                SENT
              </small>

              <h2 className="mt-2 mb-0 text-success">
                {sentCount}
              </h2>

              <p className="text-success mb-0 mt-2">
                Successfully delivered
              </p>

            </div>

          </div>

        </div>


        {/* FAILED */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                FAILED
              </small>

              <h2 className="mt-2 mb-0 text-danger">
                {failedCount}
              </h2>

              <p className="text-danger mb-0 mt-2">
                Delivery failed
              </p>

            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                PENDING
              </small>

              <h2 className="mt-2 mb-0 text-warning">
                {pendingCount}
              </h2>

              <p className="text-warning mb-0 mt-2">
                Awaiting delivery
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          NOTIFICATION TABLE
      ======================================== */}

      <section className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div>

              <p className="welcome-label mb-2">
                DELIVERY ACTIVITY
              </p>

              <h3 className="mb-1">
                Notification Logs
              </h3>

              <p className="text-muted mb-0">
                Monitor notification delivery status.
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={loadNotifications}
            >

              <i className="bi bi-arrow-clockwise me-2"></i>

              Refresh

            </button>

          </div>


          {/* ========================================
              EMPTY
          ======================================== */}

          {notifications.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-bell-slash fs-1 text-muted"></i>

              <h5 className="mt-3">
                No notifications
              </h5>

              <p className="text-muted mb-0">
                No notification records are available.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>
                      Notification
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Alert
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Sent At
                    </th>

                    <th>
                      Details
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {notifications.map(
                    (notification) => {

                      const user =
                        notification.user ||
                        {};

                      const alert =
                        notification.alert ||
                        {};

                      return (

                        <tr
                          key={
                            notification._id
                          }
                        >

                          {/* NOTIFICATION */}

                          <td>

                            <div className="d-flex align-items-center gap-3">

                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  notification.status ===
                                  "FAILED"
                                    ? "bg-danger-subtle text-danger"
                                    : notification.status ===
                                      "SENT"
                                    ? "bg-success-subtle text-success"
                                    : "bg-warning-subtle text-warning"
                                }`}
                                style={{
                                  width: "42px",
                                  height: "42px",
                                }}
                              >

                                <i className="bi bi-envelope"></i>

                              </div>

                              <div>

                                <strong>
                                  {notification.type ||
                                    notification.channel ||
                                    "SOS Notification"}
                                </strong>

                                <div className="small text-muted">

                                  {notification.channel ||
                                    "Notification"}

                                </div>

                              </div>

                            </div>

                          </td>


                          {/* USER */}

                          <td>

                            <strong>
                              {user.name ||
                                notification.recipientName ||
                                "Unknown User"}
                            </strong>

                            <div className="small text-muted">

                              {user.email ||
                                notification.recipientEmail ||
                                "—"}

                            </div>

                          </td>


                          {/* ALERT */}

                          <td>

                            <strong>

                              {alert.alertCode ||
                                notification.alertCode ||
                                notification.alert ||
                                "—"}

                            </strong>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`badge ${getStatusClass(
                                notification.status
                              )}`}
                            >

                              {notification.status ||
                                "UNKNOWN"}

                            </span>

                          </td>


                          {/* DATE */}

                          <td>

                            {formatDate(
                              notification.sentAt ||
                                notification.createdAt
                            )}

                          </td>


                          {/* DETAILS */}

                          <td>

                            {notification.errorMessage ? (

                              <span className="text-danger small">

                                <i className="bi bi-exclamation-circle me-1"></i>

                                {notification.errorMessage}

                              </span>

                            ) : notification.message ? (

                              <span className="text-muted small">

                                {notification.message}

                              </span>

                            ) : (

                              <span className="text-muted">
                                —
                              </span>

                            )}

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


      {/* ========================================
          SECURITY NOTICE
      ======================================== */}

      <div className="alert alert-warning mt-4 mb-0">

        <i className="bi bi-shield-exclamation me-2"></i>

        <strong>Notification Security:</strong>{" "}
        Notification logs may contain sensitive
        emergency information. Keep admin access secure.

      </div>

    </DashboardLayout>
  );
}

export default AdminNotifications;