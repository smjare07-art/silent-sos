import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import "../styles/auth.css";

function AcknowledgeEmergency() {
  const { token } =
    useParams();

  const [
    status,
    setStatus,
  ] = useState("loading");

  const [
    data,
    setData,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const acknowledge =
      async () => {
        if (!token) {
          setStatus("error");

          setError(
            "Invalid acknowledgement link."
          );

          return;
        }

        try {
          const response =
            await api.get(
              `/acknowledgements/${token}`
            );

          setData(
            response.data.data
          );

          if (
            response.data
              .alreadyAcknowledged
          ) {
            setStatus(
              "already"
            );
          } else {
            setStatus(
              "success"
            );
          }
        } catch (error) {
          console.error(
            "Acknowledgement failed:",
            error
          );

          setStatus("error");

          setError(
            error.response?.data
              ?.message ||
              "Unable to process this acknowledgement link."
          );
        }
      };

    acknowledge();
  }, [token]);

  return (
    <main className="auth-page">

      <div className="container">

        <div className="row justify-content-center align-items-center min-vh-100 py-4">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5">

            {/* Logo */}

            <div className="text-center mb-4">

              <div
                className={`auth-logo mx-auto mb-3 ${
                  status ===
                  "success"
                    ? "bg-success"
                    : status ===
                      "error"
                    ? "bg-danger"
                    : ""
                }`}
              >
                <i
                  className={`bi ${
                    status ===
                    "success"
                      ? "bi-check-lg"
                      : status ===
                        "error"
                      ? "bi-x-lg"
                      : "bi-shield-check"
                  }`}
                ></i>
              </div>

              <h1 className="auth-brand">
                Silent SOS
              </h1>

              <p className="text-muted mb-0">
                Emergency response
                acknowledgement
              </p>

            </div>

            {/* Card */}

            <div className="auth-card text-center">

              {/* Loading */}

              {status ===
                "loading" && (
                <>
                  <div className="mb-4">

                    <div className="spinner-border text-danger">
                    </div>

                  </div>

                  <h2 className="auth-title">
                    Processing acknowledgement
                  </h2>

                  <p className="text-muted">
                    Please wait while
                    we verify this
                    emergency alert.
                  </p>
                </>
              )}

              {/* Success */}

              {status ===
                "success" && (
                <>
                  <div className="mb-3">

                    <div
                      className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize:
                          "32px",
                      }}
                    >
                      <i className="bi bi-check-lg"></i>
                    </div>

                  </div>

                  <h2 className="auth-title">
                    Emergency
                    Acknowledged
                  </h2>

                  <p className="text-muted">
                    Your acknowledgement
                    has been successfully
                    recorded.
                  </p>

                  {data && (
                    <div
                      className="text-start mt-4 p-3 rounded"
                      style={{
                        background:
                          "#f8f9fa",
                      }}
                    >

                      <div className="mb-2">
                        <small className="text-muted d-block">
                          Contact
                        </small>

                        <strong>
                          {
                            data.contactName
                          }
                        </strong>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted d-block">
                          Alert ID
                        </small>

                        <strong>
                          {
                            data.alertCode
                          }
                        </strong>
                      </div>

                      <div>
                        <small className="text-muted d-block">
                          Status
                        </small>

                        <span className="badge bg-warning text-dark">
                          {
                            data.status
                          }
                        </span>
                      </div>

                    </div>
                  )}

                  <div className="alert alert-success text-start mt-4">
                    <i className="bi bi-info-circle me-2"></i>

                    The person who activated
                    the SOS can now see that
                    someone has acknowledged
                    the alert.
                  </div>
                </>
              )}

              {/* Already acknowledged */}

              {status ===
                "already" && (
                <>
                  <div className="mb-3">

                    <div
                      className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-success text-white"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize:
                          "32px",
                      }}
                    >
                      <i className="bi bi-check-circle"></i>
                    </div>

                  </div>

                  <h2 className="auth-title">
                    Already
                    Acknowledged
                  </h2>

                  <p className="text-muted">
                    This emergency
                    notification has
                    already been
                    acknowledged.
                  </p>

                  {data && (
                    <div className="alert alert-light text-start mt-4">

                      <strong>
                        {
                          data.contactName
                        }
                      </strong>

                      <br />

                      <small className="text-muted">
                        Acknowledgement
                        was already
                        recorded.
                      </small>

                    </div>
                  )}
                </>
              )}

              {/* Error */}

              {status ===
                "error" && (
                <>
                  <div className="mb-3">

                    <div
                      className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-danger text-white"
                      style={{
                        width: "72px",
                        height: "72px",
                        fontSize:
                          "30px",
                      }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </div>

                  </div>

                  <h2 className="auth-title">
                    Link Invalid
                  </h2>

                  <p className="text-muted">
                    We could not process
                    this acknowledgement
                    request.
                  </p>

                  <div className="alert alert-danger text-start mt-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>

                    {error}
                  </div>

                  <p className="small text-muted mt-3 mb-0">
                    The link may have
                    already been used,
                    expired, or may be
                    invalid.
                  </p>
                </>
              )}

              {/* Back */}

              {status !==
                "loading" && (
                <div className="mt-4">

                  <Link
                    to="/"
                    className="btn btn-outline-dark w-100"
                  >
                    Return to Silent SOS
                  </Link>

                </div>
              )}

            </div>

            {/* Security */}

            <div className="auth-security text-center mt-4">

              <i className="bi bi-shield-lock me-2"></i>

              Emergency acknowledgement
              is securely recorded.

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default AcknowledgeEmergency;