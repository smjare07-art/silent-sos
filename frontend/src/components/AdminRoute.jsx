import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function AdminRoute({
  children,
}) {
  const {
    user,
    authLoading,
  } = useAuth();

  const location =
    useLocation();

  console.log(
    "ADMIN ROUTE HIT:",
    location.pathname
  );

  console.log(
    "ADMIN ROUTE USER:",
    user
  );

  console.log(
    "ADMIN ROUTE ROLE:",
    user?.role
  );

  /*
    Wait until the existing
    authentication session is restored.
  */

  if (authLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
      >
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
    User is not logged in.
  */

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  /*
    Logged-in user is not admin.
  */

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /*
    Admin is allowed.
  */

  return children;
}

export default AdminRoute;