import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./hooks/useAuthStore";

// Page Imports
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ExpenseSubmissionPage from "./pages/ExpenseSubmissionPage";
import ApprovalQueuePage from "./pages/ApprovalQueuePage";
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ApprovalRulesPage from "./pages/ApprovalRulesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // 🚨 NEW: Import Forgot Password Page

// Component to protect routes and check roles
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, logout } = useAuthStore(); // Access logout function

  if (!user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Role check: Admin can access all, others must match requiredRole (case insensitive)
  if (requiredRole) {
    const userRole = user.role?.toLowerCase();
    const requiredRoleLower = requiredRole.toLowerCase();

    // Admin can access everything
    if (userRole !== "admin" && userRole !== requiredRoleLower) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return element;
};

function App() {
  const logout = useAuthStore((state) => state.logout); // Get the logout function for the route
  const initialize = useAuthStore((state) => state.initialize); // Get the initialize function

  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* === Public Auth Routes === */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> // 🚨
        NEW: Forgot Password Route
        {/* === General Protected Routes === */}
        {/* Logout route: performs the action and redirects */}
        <Route
          path="/logout"
          element={
            // Immediately call logout and redirect to login
            <Navigate to="/login" replace onClick={logout} />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute element={<Navigate to="/dashboard" replace />} />
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />
        {/* === Role-Specific Protected Routes === */}
        {/* Employee Routes */}
        <Route
          path="/submit"
          element={
            <ProtectedRoute
              element={<ExpenseSubmissionPage />}
              requiredRole="Employee"
            />
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute
              element={<ExpenseHistoryPage />}
              requiredRole="Employee"
            />
          }
        />
        {/* Manager/Admin Routes */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute
              element={<ApprovalQueuePage />}
              requiredRole="Manager"
            />
          }
        />
        {/* Admin Only Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={<AdminUsersPage />} requiredRole="Admin" />
          }
        />
        <Route
          path="/admin/rules"
          element={
            <ProtectedRoute
              element={<ApprovalRulesPage />}
              requiredRole="Admin"
            />
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
