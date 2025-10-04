import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "../../hooks/useAuthStore";

const RoleBasedNavigation = ({ role, logout }) => {
  let navItems = [{ to: "/dashboard", label: "Dashboard" }];

  // Define navigation links based on user role (case insensitive)
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "admin") {
    navItems.push({ to: "/admin/users", label: "User Management" });
    navItems.push({ to: "/admin/rules", label: "Approval Rules" });
    navItems.push({ to: "/approvals", label: "Approval Queue" });
  } else if (normalizedRole === "manager") {
    navItems.push({ to: "/approvals", label: "Approval Queue" });
  } else if (normalizedRole === "employee") {
    navItems.push({ to: "/submit", label: "Submit Expense" });
    navItems.push({ to: "/history", label: "My Expense History" });
  }

  // Logout link (uses the store's logout function)
  navItems.push({ to: "/login", label: "Logout", onClick: logout });

  return (
    <nav
      style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h3 style={{ margin: 0 }}>Expense Manager ({role})</h3>
        <div>
          {navItems.map((item) => (
            <RouterLink
              key={item.to}
              to={item.to}
              onClick={item.onClick}
              style={{
                margin: "0 15px",
                textDecoration: "none",
                color: "#333",
              }}
            >
              {item.label}
            </RouterLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const role = user?.role || "Guest";

  if (!user) return null;

  return (
    <div>
      <RoleBasedNavigation role={role} logout={logout} />
      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
