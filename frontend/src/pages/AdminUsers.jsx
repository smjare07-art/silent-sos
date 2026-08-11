
import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/users"
      );

      setUsers(
        response.data?.data?.users || []
      );
    } catch (error) {
      console.error(
        "Admin users failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ========================================
     ENABLE / DISABLE USER
  ======================================== */

  const handleUserStatus = async (user) => {
    const nextStatus =
      !user.isActive;

    const actionText =
      nextStatus
        ? "enable"
        : "disable";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${actionText} ${user.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `status-${user._id}`
      );

      await api.patch(
        `/admin/users/${user._id}/status`,
        {
          isActive: nextStatus,
        }
      );

      setUsers(
        (previousUsers) =>
          previousUsers.map(
            (item) =>
              item._id === user._id
                ? {
                    ...item,
                    isActive:
                      nextStatus,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "User status update failed:",
        error
      );

      window.alert(
        error.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* ========================================
     CHANGE ROLE
  ======================================== */

  const handleUserRole = async (user) => {
    const newRole =
      user.role === "admin"
        ? "user"
        : "admin";

    const confirmed =
      window.confirm(
        `Change ${user.name}'s role from ${user.role} to ${newRole}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `role-${user._id}`
      );

      await api.patch(
        `/admin/users/${user._id}/role`,
        {
          role: newRole,
        }
      );

      setUsers(
        (previousUsers) =>
          previousUsers.map(
            (item) =>
              item._id === user._id
                ? {
                    ...item,
                    role: newRole,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "User role update failed:",
        error
      );

      window.alert(
        error.response?.data?.message ||
          "Unable to update user role."
      );
    } finally {
      setActionLoading("");
    }
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
            Loading users...
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

        </div>

      </DashboardLayout>
    );
  }

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
            Users
          </h1>

          <p>
            Manage registered Silent SOS
            user accounts and roles.
          </p>

        </div>

        <div className="safety-badge">

          <i className="bi bi-people"></i>

          <div>

            <strong>
              User Management
            </strong>

            <span>
              {users.length} registered users
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          USER MANAGEMENT CARD
      ======================================== */}

      <section className="card border-0 shadow-sm">

        <div className="card-body p-4">

          {/* Header */}

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div>

              <p className="welcome-label mb-2">
                REGISTERED USERS
              </p>

              <h3 className="mb-1">
                User Accounts
              </h3>

              <p className="text-muted mb-0">
                Manage account status and
                administrator privileges.
              </p>

            </div>

            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={loadUsers}
              disabled={loading}
            >

              <i className="bi bi-arrow-clockwise me-2"></i>

              Refresh Users

            </button>

          </div>


          {/* ========================================
              USER TABLE
          ======================================== */}

          {users.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-people fs-1 text-muted"></i>

              <p className="text-muted mt-3 mb-0">
                No users found.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle mb-0">

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Last Login
                    </th>

                    <th className="text-end">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => {

                    const statusLoading =
                      actionLoading ===
                      `status-${user._id}`;

                    const roleLoading =
                      actionLoading ===
                      `role-${user._id}`;

                    const isActionLoading =
                      statusLoading ||
                      roleLoading;

                    return (

                      <tr
                        key={user._id}
                      >

                        {/* USER */}

                        <td>

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                              style={{
                                width: "44px",
                                height: "44px",
                              }}
                            >

                              <strong>

                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}

                              </strong>

                            </div>

                            <div>

                              <strong>
                                {user.name}
                              </strong>

                              <div className="small text-muted">
                                {user.email}
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* PHONE */}

                        <td>
                          {user.phone || "—"}
                        </td>


                        {/* ROLE */}

                        <td>

                          {user.role ===
                          "admin" ? (

                            <span className="badge text-bg-danger">

                              <i className="bi bi-shield-fill me-1"></i>

                              ADMIN

                            </span>

                          ) : (

                            <span className="badge text-bg-primary">

                              <i className="bi bi-person me-1"></i>

                              USER

                            </span>

                          )}

                        </td>


                        {/* STATUS */}

                        <td>

                          {user.isActive ? (

                            <span className="badge text-bg-success">

                              <i className="bi bi-check-circle me-1"></i>

                              ACTIVE

                            </span>

                          ) : (

                            <span className="badge text-bg-secondary">

                              <i className="bi bi-slash-circle me-1"></i>

                              DISABLED

                            </span>

                          )}

                        </td>


                        {/* LAST LOGIN */}

                        <td>

                          {user.lastLogin
                            ? new Date(
                                user.lastLogin
                              ).toLocaleString()
                            : "Never"}

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="d-flex justify-content-end gap-2 flex-wrap">

                            {/* STATUS */}

                            <button
                              type="button"
                              className={
                                user.isActive
                                  ? "btn btn-sm btn-outline-danger"
                                  : "btn btn-sm btn-outline-success"
                              }
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                handleUserStatus(
                                  user
                                )
                              }
                            >

                              {statusLoading ? (

                                <span className="spinner-border spinner-border-sm"></span>

                              ) : (

                                <>

                                  <i
                                    className={`bi ${
                                      user.isActive
                                        ? "bi-person-x"
                                        : "bi-person-check"
                                    } me-1`}
                                  ></i>

                                  {user.isActive
                                    ? "Disable"
                                    : "Enable"}

                                </>

                              )}

                            </button>


                            {/* ROLE */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              disabled={
                                isActionLoading
                              }
                              onClick={() =>
                                handleUserRole(
                                  user
                                )
                              }
                            >

                              {roleLoading ? (

                                <span className="spinner-border spinner-border-sm"></span>

                              ) : (

                                <>

                                  <i className="bi bi-arrow-left-right me-1"></i>

                                  {user.role ===
                                  "admin"
                                    ? "Make User"
                                    : "Make Admin"}

                                </>

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

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

        <strong>Admin Security:</strong>{" "}
        Changes to user roles and account
        status affect access to the Silent SOS
        system.

      </div>

    </DashboardLayout>
  );
}

export default AdminUsers;
