import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getAlertHistory,
} from "../services/alertService";

function AlertHistory() {
  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadHistory =
      async () => {
        try {
          const response =
            await getAlertHistory();

          setAlerts(
            response.data.alerts
          );
        } catch (error) {
          setError(
            error.response?.data
              ?.message ||
              "Unable to load alert history."
          );
        } finally {
          setLoading(false);
        }
      };

    loadHistory();
  }, []);

  return (
    <DashboardLayout>

      <div className="mb-4">
        <span className="section-eyebrow">
          SAFETY ACTIVITY
        </span>

        <h1 className="mt-1 fs-3 fw-bold">
          Alert History
        </h1>

        <p className="text-muted small">
          Review your recent Silent SOS
          activity.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          {loading ? (
            <div className="text-center py-5">

              <div className="spinner-border text-danger"></div>

            </div>
          ) : alerts.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-clock-history fs-1 text-muted"></i>

              <h5 className="mt-3">
                No alert history
              </h5>

              <p className="text-muted small">
                Your emergency activity
                will appear here.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>
                      Alert ID
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Location
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {alerts.map(
                    (alert) => (
                      <tr key={alert._id}>

                        <td>
                          <code>
                            {
                              alert.alertCode
                            }
                          </code>
                        </td>

                        <td>
                          {new Date(
                            alert.triggeredAt
                          ).toLocaleString()}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              alert.status ===
                              "RESOLVED"
                                ? "text-bg-success"
                                : alert.status ===
                                  "CANCELLED"
                                ? "text-bg-secondary"
                                : "text-bg-danger"
                            }`}
                          >
                            {
                              alert.status
                            }
                          </span>
                        </td>

                        <td>
                          {alert.initialLocation
                            ?.latitude?.toFixed(
                              4
                            )}
                          ,{" "}
                          {alert.initialLocation
                            ?.longitude?.toFixed(
                              4
                            )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AlertHistory;