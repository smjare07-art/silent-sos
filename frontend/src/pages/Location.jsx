import DashboardLayout from "../layouts/DashboardLayout";

import LocationMap from "../components/LocationMap";

import useGeolocation from "../hooks/useGeolocation";

import "../styles/location.css";

function Location() {
  const {
    location,
    error,
    loading,
    watching,
    getCurrentLocation,
    startWatching,
    stopWatching,
  } = useGeolocation();

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "Not available";
    }

    return new Date(
      timestamp
    ).toLocaleTimeString();
  };

  return (
    <DashboardLayout>

      <section className="location-heading">
        <div>
          <span className="section-eyebrow">
            LOCATION SERVICES
          </span>

          <h1>Live Location</h1>

          <p>
            Verify your device location before
            using the emergency alert system.
          </p>
        </div>
      </section>

      <div className="row g-4 mt-1">

        {/* Location controls */}

        <div className="col-12 col-xl-4">

          <section className="location-control-card">

            <div className="location-icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <h2>
              Location Access
            </h2>

            <p>
              Silent SOS requires your location
              to provide useful emergency
              information to trusted contacts.
            </p>

            {!watching ? (
              <>
                <button
                  type="button"
                  className="btn btn-sos w-100 mt-3"
                  onClick={
                    getCurrentLocation
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Locating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-crosshair me-2"></i>
                      Get My Location
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark w-100 mt-2"
                  onClick={
                    startWatching
                  }
                >
                  <i className="bi bi-broadcast me-2"></i>
                  Start Live Tracking
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-outline-danger w-100 mt-3"
                onClick={
                  stopWatching
                }
              >
                <i className="bi bi-stop-circle me-2"></i>
                Stop Live Tracking
              </button>
            )}

            {watching && (
              <div className="tracking-status">
                <span className="tracking-dot"></span>

                Live location tracking active
              </div>
            )}

            {error && (
              <div
                className="alert alert-danger mt-3 mb-0"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle me-2"></i>

                {error.message}
              </div>
            )}

          </section>

          {location && (
            <section className="location-data-card">

              <span className="section-eyebrow">
                LOCATION DATA
              </span>

              <div className="location-data-row">
                <span>Latitude</span>

                <strong>
                  {location.latitude.toFixed(
                    6
                  )}
                </strong>
              </div>

              <div className="location-data-row">
                <span>Longitude</span>

                <strong>
                  {location.longitude.toFixed(
                    6
                  )}
                </strong>
              </div>

              <div className="location-data-row">
                <span>Accuracy</span>

                <strong>
                  ±
                  {Math.round(
                    location.accuracy
                  )}{" "}
                  meters
                </strong>
              </div>

              <div className="location-data-row">
                <span>Last Update</span>

                <strong>
                  {formatTime(
                    location.timestamp
                  )}
                </strong>
              </div>

            </section>
          )}

        </div>

        {/* Map */}

        <div className="col-12 col-xl-8">

          <section className="location-map-card">

            <div className="location-map-header">
              <div>
                <span className="section-eyebrow">
                  MAP
                </span>

                <h2>
                  Current Position
                </h2>
              </div>

              {location && (
                <span className="location-available">
                  <i className="bi bi-check-circle-fill"></i>
                  Location Available
                </span>
              )}
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
              <div className="location-placeholder">

                <div>
                  <i className="bi bi-map"></i>
                </div>

                <h3>
                  Location not available
                </h3>

                <p>
                  Allow location access to
                  display your position on the
                  map.
                </p>

              </div>
            )}

          </section>

        </div>

      </div>

      <div className="location-privacy mt-4">
        <i className="bi bi-shield-lock"></i>

        <div>
          <strong>
            Location Privacy
          </strong>

          <p>
            Your browser asks for permission
            before sharing location. This page
            currently displays location locally;
            persistent emergency-location storage
            will only be added as part of the SOS
            alert workflow.
          </p>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Location;