import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuthStore } from "../hooks/useAuthStore";
import { getMockDashboardStats } from "../services/mockDataService";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    pendingExpenses: 0,
    approvedExpenses: 0,
    totalAmount: 0,
    recentExpenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      console.log("Current user:", user); // Debug log

      // Use user role or default to 'Employee' if no user
      const userRole = user?.role || "Employee";

      // Use comprehensive mock data service
      const mockData = getMockDashboardStats(userRole);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStats(mockData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Set fallback data
      setStats({
        pendingExpenses: 0,
        approvedExpenses: 0,
        totalAmount: 0,
        recentExpenses: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedContent = () => {
    const userRole = user?.role || "Employee"; // Default to Employee if no user
    const normalizedRole = userRole?.toLowerCase();

    switch (normalizedRole) {
      case "admin":
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Approvals</h3>
                <p className="stat-number">{stats.pendingExpenses}</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Expenses</h3>
                <p className="stat-number">
                  ${stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <h3>Approved This Month</h3>
                <p className="stat-number">{stats.approvedExpenses}</p>
              </div>
            </div>
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <a href="/admin/users" className="action-btn">
                  Manage Users
                </a>
                <a href="/approvals" className="action-btn">
                  Review Approvals
                </a>
                <a href="/admin/rules" className="action-btn">
                  Configure Rules
                </a>
              </div>
            </div>
          </div>
        );

      case "manager":
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Pending Approvals</h3>
                <p className="stat-number">{stats.pendingExpenses}</p>
              </div>
              <div className="stat-card">
                <h3>Team Expenses</h3>
                <p className="stat-number">
                  ${stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <h3>Approved This Month</h3>
                <p className="stat-number">{stats.approvedExpenses}</p>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Team Expenses</h3>
              <div className="expense-list">
                {stats.recentExpenses.length > 0 ? (
                  stats.recentExpenses.map((expense) => (
                    <div key={expense.id} className="expense-item">
                      <div className="expense-info">
                        <span className="expense-description">
                          {expense.description}
                        </span>
                        <span className="expense-amount">
                          ${expense.amount}
                        </span>
                      </div>
                      <div className="expense-meta">
                        <span
                          className={`status status-${expense.status.toLowerCase()}`}
                        >
                          {expense.status}
                        </span>
                        <span className="expense-date">{expense.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No recent expenses found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "employee":
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>My Pending</h3>
                <p className="stat-number">{stats.pendingExpenses}</p>
              </div>
              <div className="stat-card">
                <h3>Total Submitted</h3>
                <p className="stat-number">
                  ${stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <h3>Approved This Month</h3>
                <p className="stat-number">{stats.approvedExpenses}</p>
              </div>
            </div>
            <div className="recent-activity">
              <h3>My Recent Expenses</h3>
              <div className="expense-list">
                {stats.recentExpenses.length > 0 ? (
                  stats.recentExpenses.map((expense) => (
                    <div key={expense.id} className="expense-item">
                      <div className="expense-info">
                        <span className="expense-description">
                          {expense.description}
                        </span>
                        <span className="expense-amount">
                          ${expense.amount}
                        </span>
                      </div>
                      <div className="expense-meta">
                        <span
                          className={`status status-${expense.status.toLowerCase()}`}
                        >
                          {expense.status}
                        </span>
                        <span className="expense-date">{expense.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>
                      No recent expenses found.{" "}
                      <a href="/submit">Submit your first expense</a>!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <p>Welcome! Please contact your administrator for access.</p>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-spinner">Loading dashboard...</div>
      </MainLayout>
    );
  }

  // If no user is authenticated, show a login prompt with test user options
  if (!user) {
    const setTestUser = (role) => {
      const testUsers = {
        Admin: {
          id: 1,
          name: "Admin User",
          role: "Admin",
          companyCurrency: "USD",
        },
        Manager: {
          id: 2,
          name: "Manager User",
          role: "Manager",
          companyCurrency: "USD",
        },
        Employee: {
          id: 3,
          name: "Employee User",
          role: "Employee",
          companyCurrency: "USD",
        },
      };
      useAuthStore.getState().login(testUsers[role]);
    };

    return (
      <MainLayout>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Please log in to view your dashboard.</p>
        </div>
        <div className="dashboard-content">
          <div className="empty-state">
            <h3>Not Authenticated</h3>
            <p>You need to log in to access the dashboard.</p>
            <div className="action-buttons">
              <a href="/login" className="action-btn">
                Login
              </a>
              <a href="/signup" className="action-btn">
                Sign Up
              </a>
            </div>
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#f7fafc",
                borderRadius: "8px",
              }}
            >
              <h4>Test Users (for demo purposes):</h4>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => setTestUser("Admin")}
                >
                  Login as Admin
                </button>
                <button
                  className="action-btn"
                  onClick={() => setTestUser("Manager")}
                >
                  Login as Manager
                </button>
                <button
                  className="action-btn"
                  onClick={() => setTestUser("Employee")}
                >
                  Login as Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || "User"}!</p>
        </div>
        <button
          className="action-btn"
          onClick={loadDashboardData}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      {getRoleBasedContent()}
    </MainLayout>
  );
};

export default DashboardPage;
