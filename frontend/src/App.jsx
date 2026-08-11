
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import ActiveAlert from "./pages/ActiveAlert";
import AlertHistory from "./pages/AlertHistory";
import Profile from "./pages/Profile";
import Location from "./pages/Location";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import AcknowledgeEmergency from "./pages/AcknowledgeEmergency";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAlerts from "./pages/AdminAlerts";
import AdminNotifications from "./pages/AdminNotifications";
// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC HOME
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =========================
            AUTH ROUTES
        ========================== */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
  path="/reset-password/:token"
  element={
    <ResetPassword />
  }
/>
        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsers />
    </AdminRoute>
  }
/>
<Route
  path="/admin/alerts"
  element={
    <AdminRoute>
      <AdminAlerts />
    </AdminRoute>
  }
/>
<Route
  path="/admin/notifications"
  element={
    <AdminRoute>
      <AdminNotifications />
    </AdminRoute>
  }
/>
        <Route
          path="/emergency-contacts"
          element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          }
        />

        <Route
          path="/active-alert"
          element={
            <ProtectedRoute>
              <ActiveAlert />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alert-history"
          element={
            <ProtectedRoute>
              <AlertHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/acknowledge/:token"
  element={
    <AcknowledgeEmergency />
  }
/>
        {/* =========================
            404
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
