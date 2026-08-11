
import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function AdminDashboard() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [kpis, setKpis] =
  useState(null);

const [kpisLoading, setKpisLoading] =
  useState(true);const loadKpis = async () => {
  try {
    setKpisLoading(true);

    const response =
      await api.get(
        "/admin/kpis"
      );

    setKpis(
      response.data?.data || null
    );
  } catch (error) {
    console.error(
      "Admin KPI loading failed:",
      error
    );
  } finally {
    setKpisLoading(false);
  }
};

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/dashboard"
      );

      setData(
        response.data?.data
      );
    } catch (error) {
      console.error(
        "Admin dashboard failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
     loadKpis();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>

          <p className="mt-3 text-muted">
            Loading admin dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>

          {error}
        </div>
      </DashboardLayout>
    );
  }

  const totalUsers =
    data?.users?.total ?? 0;

  const activeUsers =
    data?.users?.active ?? 0;

  const totalAlerts =
    data?.alerts?.total ?? 0;

  const activeAlerts =
    data?.alerts?.active ?? 0;

  const emergencyContacts =
    data?.emergencyContacts ?? 0;

  const notifications =
    data?.notifications?.total ??
    data?.notifications?.sent ??
    0;

  const failedNotifications =
    data?.notifications?.failed ?? 0;

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
            Admin Dashboard
          </h1>

          <p>
            Monitor Silent SOS emergency
            activity and system status.
          </p>
        </div>

        <div className="safety-badge">
          <i className="bi bi-shield-check"></i>

          <div>
            <strong>
              Admin Access
            </strong>

            <span>
              System monitoring enabled
            </span>
          </div>
        </div>

      </section>


      {/* ========================================
          ACTIVE ALERT - MAIN PRIORITY
      ======================================== */}

      <section
        className={`card border-0 shadow-sm mb-4 ${
          activeAlerts > 0
            ? "border-start border-danger border-5"
            : ""
        }`}
      >

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div className="d-flex align-items-center gap-3">

              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${
                  activeAlerts > 0
                    ? "bg-danger text-white"
                    : "bg-success text-white"
                }`}
                style={{
                  width: "58px",
                  height: "58px",
                  fontSize: "24px",
                }}
              >
                <i
                  className={
                    activeAlerts > 0
                      ? "bi bi-exclamation-triangle-fill"
                      : "bi bi-shield-check"
                  }
                ></i>
              </div>

              <div>

                <small className="text-muted">
                  ACTIVE EMERGENCY ALERTS
                </small>

                <h2 className="mb-0 mt-1 fw-bold">
                  {activeAlerts}
                </h2>

                <p
                  className={`mb-0 mt-1 ${
                    activeAlerts > 0
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {activeAlerts > 0
                    ? "Immediate attention required"
                    : "No active emergencies"}
                </p>

              </div>

            </div>


            {activeAlerts > 0 && (
              <div className="text-danger fw-semibold">

                <span className="me-2">
                  <span
                    className="d-inline-block rounded-circle bg-danger"
                    style={{
                      width: "9px",
                      height: "9px",
                    }}
                  ></span>
                </span>

                LIVE EMERGENCY

              </div>
            )}

          </div>

        </div>

      </section>

{/* ========================================
    KPI ANALYTICS
======================================== */}

<section className="card border-0 shadow-sm mt-4">

  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

      <div>

        <p className="welcome-label mb-2">
          KPI ANALYTICS
        </p>

        <h3 className="mb-1">
          Emergency Response Performance
        </h3>

        <p className="text-muted mb-0">
          Real-time performance metrics calculated
          from emergency alert and notification data.
        </p>

      </div>

      <span className="badge text-bg-success">
        <i className="bi bi-activity me-1"></i>
        LIVE DATA
      </span>

    </div>

    {kpisLoading ? (

      <div className="text-center py-5">

        <div className="spinner-border text-danger"></div>

        <p className="text-muted mt-3 mb-0">
          Calculating KPIs...
        </p>

      </div>

    ) : kpis ? (

      <div className="row g-4 mt-2">

        {/* Average Delivery */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 bg-light h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>

                  <small className="text-muted">
                    AVG DELIVERY TIME
                  </small>

                  <h2 className="mt-2 mb-0">
                    {kpis.delivery.averageSeconds}s
                  </h2>

                </div>

                <div className="fs-1 text-primary">
                  <i className="bi bi-stopwatch"></i>
                </div>

              </div>

              <p className="text-muted mt-3 mb-0">
                Alert trigger → notification sent
              </p>

            </div>

          </div>

        </div>

        {/* Delivery Success */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 bg-light h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>

                  <small className="text-muted">
                    DELIVERY SUCCESS
                  </small>

                  <h2 className="mt-2 mb-0">
                    {kpis.notifications.deliverySuccessRate}%
                  </h2>

                </div>

                <div className="fs-1 text-success">
                  <i className="bi bi-check-circle"></i>
                </div>

              </div>

              <p className="text-success mt-3 mb-0">
                {kpis.notifications.sent} successful
              </p>

            </div>

          </div>

        </div>

        {/* Acknowledgement */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 bg-light h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>

                  <small className="text-muted">
                    ACKNOWLEDGEMENT RATE
                  </small>

                  <h2 className="mt-2 mb-0">
                    {kpis.notifications.acknowledgementRate}%
                  </h2>

                </div>

                <div className="fs-1 text-warning">
                  <i className="bi bi-hand-thumbs-up"></i>
                </div>

              </div>

              <p className="text-muted mt-3 mb-0">
                Contacts who acknowledged
              </p>

            </div>

          </div>

        </div>

        {/* Resolution */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 bg-light h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between">

                <div>

                  <small className="text-muted">
                    ALERT RESOLUTION
                  </small>

                  <h2 className="mt-2 mb-0">
                    {kpis.alerts.resolutionRate}%
                  </h2>

                </div>

                <div className="fs-1 text-danger">
                  <i className="bi bi-shield-check"></i>
                </div>

              </div>

              <p className="text-muted mt-3 mb-0">
                Resolved vs completed alerts
              </p>

            </div>

          </div>

        </div>

      </div>

    ) : (

      <div className="alert alert-warning mt-4 mb-0">
        KPI data is currently unavailable.
      </div>

    )}

  </div>

</section>
{kpis && (
  <div className="row g-3 mt-2">

    <div className="col-12 col-md-4">

      <div className="p-3 border rounded">

        <small className="text-muted">
          ALERT SUMMARY
        </small>

        <div className="mt-2">
          <strong>
            {kpis.alerts.total}
          </strong>{" "}
          total alerts
        </div>

        <div className="text-danger">
          {kpis.alerts.active} active
        </div>

        <div className="text-success">
          {kpis.alerts.resolved} resolved
        </div>

        <div className="text-secondary">
          {kpis.alerts.cancelled} cancelled
        </div>

      </div>

    </div>


    <div className="col-12 col-md-4">

      <div className="p-3 border rounded">

        <small className="text-muted">
          NOTIFICATION SUMMARY
        </small>

        <div className="mt-2">
          <strong>
            {kpis.notifications.total}
          </strong>{" "}
          total notifications
        </div>

        <div className="text-success">
          {kpis.notifications.sent} sent
        </div>

        <div className="text-danger">
          {kpis.notifications.failed} failed
        </div>

        <div className="text-secondary">
          {kpis.notifications.skipped} skipped
        </div>

      </div>

    </div>


    <div className="col-12 col-md-4">

      <div className="p-3 border rounded">

        <small className="text-muted">
          DELIVERY PERFORMANCE
        </small>

        <div className="mt-2">
          Fastest:{" "}
          <strong>
            {kpis.delivery.fastestSeconds}s
          </strong>
        </div>

        <div>
          Average:{" "}
          <strong>
            {kpis.delivery.averageSeconds}s
          </strong>
        </div>

        <div>
          Slowest:{" "}
          <strong>
            {kpis.delivery.slowestSeconds}s
          </strong>
        </div>

        <div className="text-success mt-1">
          System: ONLINE
        </div>

      </div>

    </div>

  </div>
)}
      {/* ========================================
          SUMMARY CARDS
      ======================================== */}

      <div className="row g-4">

        {/* TOTAL USERS */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    TOTAL USERS
                  </small>

                  <h2 className="mt-2 mb-0 fw-bold">
                    {totalUsers}
                  </h2>

                </div>

                <div className="fs-1 text-primary">
                  <i className="bi bi-people"></i>
                </div>

              </div>

              <p className="text-success mt-3 mb-0">

                <i className="bi bi-person-check me-1"></i>

                {activeUsers} active users

              </p>

            </div>

          </div>

        </div>


        {/* TOTAL ALERTS */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    TOTAL ALERTS
                  </small>

                  <h2 className="mt-2 mb-0 fw-bold">
                    {totalAlerts}
                  </h2>

                </div>

                <div className="fs-1 text-danger">
                  <i className="bi bi-broadcast"></i>
                </div>

              </div>

              <p className="text-danger mt-3 mb-0">

                <i className="bi bi-exclamation-circle me-1"></i>

                {activeAlerts} active alerts

              </p>

            </div>

          </div>

        </div>


        {/* EMERGENCY CONTACTS */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    EMERGENCY CONTACTS
                  </small>

                  <h2 className="mt-2 mb-0 fw-bold">
                    {emergencyContacts}
                  </h2>

                </div>

                <div className="fs-1 text-success">
                  <i className="bi bi-person-heart"></i>
                </div>

              </div>

              <p className="text-muted mt-3 mb-0">
                Trusted contacts configured
              </p>

            </div>

          </div>

        </div>


        {/* NOTIFICATIONS */}

        <div className="col-12 col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted">
                    NOTIFICATIONS
                  </small>

                  <h2 className="mt-2 mb-0 fw-bold">
                    {notifications}
                  </h2>

                </div>

                <div className="fs-1 text-warning">
                  <i className="bi bi-envelope"></i>
                </div>

              </div>

              <p className="text-danger mt-3 mb-0">

                <i className="bi bi-x-circle me-1"></i>

                {failedNotifications} failed

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          SYSTEM STATUS
      ======================================== */}

      <section className="card border-0 shadow-sm mt-4">

        <div className="card-body p-4">

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
              }}
            >
              <i className="bi bi-check-lg fs-4"></i>
            </div>

            <div>

              <small className="text-muted">
                SYSTEM STATUS
              </small>

              <h5 className="mb-0 mt-1">
                Silent SOS services are online
              </h5>

            </div>

            <div className="ms-auto">

              <span className="badge text-bg-success">
                <i className="bi bi-circle-fill me-1"></i>
                ONLINE
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          ADMIN NOTE
      ======================================== */}

      <div className="alert alert-warning mt-4 mb-0">

        <i className="bi bi-shield-exclamation me-2"></i>

        <strong>Admin Security:</strong>{" "}
        Emergency information is sensitive.
        Keep administrator credentials secure.

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;
