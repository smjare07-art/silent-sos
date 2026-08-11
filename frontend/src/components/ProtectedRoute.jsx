import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function ProtectedRoute({
  children,
}) {
  const {
    user,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location =
    useLocation();

  if (authLoading) {
    return (
      <div className="auth-loader-screen">

        <div
          className="spinner-border text-danger"
          role="status"
        >
          <span className="visually-hidden">
            Restoring secure session...
          </span>
        </div>

        <p>
          Restoring secure session...
        </p>

      </div>
    );
  }

  /*
    Not logged in
  */

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
    Admin should never enter
    normal user routes.

    Send admin back to
    Admin Dashboard.
  */

  if (
    user.role === "admin" &&
    location.pathname !== "/admin"
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  /*
    Normal user is allowed.
  */

  return children;
}

export default ProtectedRoute;