import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function PublicRoute({
  children,
}) {
  const {
    user,
    isAuthenticated,
    authLoading,
  } = useAuth();

  /*
    Wait until the existing
    session is restored.
  */

  if (authLoading) {
    return (
      <div className="auth-loader-screen">
        <div
          className="spinner-border text-danger"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  /*
    Already logged in.

    Admin -> Admin Dashboard
    User  -> User Dashboard
  */

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default PublicRoute;