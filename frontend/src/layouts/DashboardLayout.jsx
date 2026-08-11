import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";

import "../styles/dashboard.css";

function DashboardLayout({
  children,
}) {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const isAdmin =
    user?.role === "admin";

  const handleLogout =
    async () => {
      if (loggingOut) {
        return;
      }

      try {
        setLoggingOut(true);

        await logout();

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } finally {
        setLoggingOut(false);
      }
    };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /*
    USER MENU
  */

  const userMenuItems = [
    {
      path: "/dashboard",
      icon: "bi-grid",
      label: "Dashboard",
    },

    {
      path: "/emergency-contacts",
      icon: "bi-people",
      label: "Emergency Contacts",
    },

    {
      path: "/location",
      icon: "bi-geo-alt",
      label: "Live Location",
    },

    {
      path: "/active-alert",
      icon: "bi-broadcast",
      label: "Active Alert",
    },

    {
      path: "/alert-history",
      icon: "bi-clock-history",
      label: "Alert History",
    },

    {
      path: "/profile",
      icon: "bi-person",
      label: "Profile",
    },
  ];

  /*
    ADMIN MENU

    Admin code stays in layout,
    not in App.jsx route logic.
  */

  const adminMenuItems = [
    {
      path: "/admin",
      icon: "bi-speedometer2",
      label: "Admin Dashboard",
    },

    {
      path: "/admin/users",
      icon: "bi-people",
      label: "Users",
    },

    {
      path: "/admin/alerts",
      icon: "bi-broadcast",
      label: "Emergency Alerts",
    },

    {
      path: "/admin/notifications",
      icon: "bi-envelope",
      label: "Notifications",
    },
  ];

  const menuItems = isAdmin
    ? adminMenuItems
    : userMenuItems;

  return (
    <div className="dashboard-shell">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={
            closeSidebar
          }
        />
      )}

      {/* Sidebar */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* Brand */}

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <i className="bi bi-shield-fill-check"></i>
          </div>

          <div>

            <div className="sidebar-brand-name">
              Silent SOS
            </div>

            <div className="sidebar-brand-subtitle">
              {isAdmin
                ? "Admin Network"
                : "Safety Network"}
            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="sidebar-navigation">

          <p className="sidebar-label">
            {isAdmin
              ? "ADMIN CONTROL CENTER"
              : "SAFETY CENTER"}
          </p>

          {menuItems.map(
            (item) => (
              <NavLink
                key={
                  item.path
                }
                to={
                  item.path
                }
                onClick={
                  closeSidebar
                }
                end={
                  item.path ===
                  "/admin"
                }
                className={({
                  isActive,
                }) =>
                  `sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >

                <i
                  className={`bi ${item.icon}`}
                ></i>

                <span>
                  {item.label}
                </span>

              </NavLink>
            )
          )}

        </nav>

        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          <div className="sidebar-safety-card">

            <i
              className={
                isAdmin
                  ? "bi bi-shield-check"
                  : "bi bi-shield-check"
              }
            ></i>

            <div>

              <strong>
                {isAdmin
                  ? "Admin Security"
                  : "Safety Tip"}
              </strong>

              <span>
                {isAdmin
                  ? "Keep administrator credentials secure."
                  : "Keep your emergency contacts updated."}
              </span>

            </div>

          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
          >

            {loggingOut ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>

                Logging out...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-right"></i>

                Logout
              </>
            )}

          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="dashboard-main">

        {/* Topbar */}

        <header className="dashboard-topbar">

          <div className="d-flex align-items-center gap-3">

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              aria-label="Open navigation"
            >
              <i className="bi bi-list"></i>
            </button>

            <div>

              <h2 className="topbar-title">
                {isAdmin
                  ? "Admin Dashboard"
                  : "Safety Dashboard"}
              </h2>

              <p className="topbar-subtitle">
                {isAdmin
                  ? "Monitor Silent SOS emergency activity."
                  : "Stay connected. Stay protected."}
              </p>

            </div>

          </div>

          <div className="topbar-actions">

            {/* Service Status */}

            <div className="system-status">

              <span className="status-dot"></span>

              Service Online

            </div>

            {/* User */}

            <NavLink
              to={
                isAdmin
                  ? "/admin"
                  : "/profile"
              }
              className="user-profile"
            >

              <div className="user-avatar">

                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}

              </div>

              <div className="user-profile-info">

                <strong>
                  {user?.name ||
                    "User"}
                </strong>

                <span>
                  {user?.email ||
                    ""}
                </span>

              </div>

            </NavLink>

          </div>

        </header>

        {/* Content */}

        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;