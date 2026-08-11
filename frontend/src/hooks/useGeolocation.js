import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useGeolocation() {
  const watchIdRef = useRef(null);

  const [location, setLocation] =
    useState(null);

  const [error, setError] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [watching, setWatching] =
    useState(false);

  const handleSuccess = useCallback(
    (position) => {
      const {
        latitude,
        longitude,
        accuracy,
        altitude,
        heading,
        speed,
      } = position.coords;

      setLocation({
        latitude,
        longitude,
        accuracy,
        altitude,
        heading,
        speed,
        timestamp: position.timestamp,
      });

      setError(null);
      setLoading(false);
    },
    []
  );

  const handleError = useCallback(
    (geoError) => {
      let message =
        "Unable to access your location.";

      switch (geoError.code) {
        case 1:
          message =
            "Location permission was denied. Please enable location access in your browser settings.";
          break;

        case 2:
          message =
            "Your location is currently unavailable.";
          break;

        case 3:
          message =
            "Location request timed out. Please try again.";
          break;

        default:
          break;
      }

      setError({
        code: geoError.code,
        message,
      });

      setLoading(false);
    },
    []
  );

  const getCurrentLocation =
    useCallback(() => {
      if (!navigator.geolocation) {
        setError({
          code: 0,
          message:
            "Geolocation is not supported by this browser.",
        });

        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }, [handleSuccess, handleError]);

  const startWatching =
    useCallback(() => {
      if (!navigator.geolocation) {
        setError({
          code: 0,
          message:
            "Geolocation is not supported by this browser.",
        });

        return;
      }

      if (watchIdRef.current !== null) {
        return;
      }

      setLoading(true);
      setError(null);

      watchIdRef.current =
        navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
          }
        );

      setWatching(true);
    }, [handleSuccess, handleError]);

  const stopWatching =
    useCallback(() => {
      if (
        watchIdRef.current !== null &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current = null;
      }

      setWatching(false);
      setLoading(false);
    }, []);

  useEffect(() => {
    return () => {
      if (
        watchIdRef.current !== null &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }
    };
  }, []);

  return {
    location,
    error,
    loading,
    watching,
    getCurrentLocation,
    startWatching,
    stopWatching,
  };
}

export default useGeolocation;