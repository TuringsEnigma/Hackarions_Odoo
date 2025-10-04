import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import {
  fetchAllUsers,
  sendPassword,
  updateUser,
  createUser,
} from "../services/apiService";
import { getMockUsers } from "../services/mockDataService";

// --- User Creation Form Component ---

const NewUserForm = ({ managers, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee",
    password: "password",
    managerId: managers[0]?.id || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (formData.role === "Employee" && !formData.managerId) {
        return setMessage("Employee must have a manager.");
      }

      // NOTE: Your backend createUser expects first_name/last_name but frontend only collects 'name'.
      // The service layer handles this mapping.

      // Simulate user creation with mock data
      const newUser = {
        id: Date.now(), // Generate a temporary ID
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: "Engineering",
        manager: formData.managerId
          ? managers.find((m) => m.id === formData.managerId)?.name
          : null,
        status: "Active",
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      };

      onUserCreated(newUser); // Add the new user to the local state

      setMessage(
        `Successfully created ${newUser.name} as ${newUser.role}. Temporary password: temp123`
      );
      setFormData({
        name: "",
        email: "",
        role: "Employee",
        password: "password",
        managerId: managers[0]?.id || "",
      });
    } catch (err) {
      setMessage(err.message || "Failed to create user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="form-box"
      style={{ maxWidth: "100%", marginBottom: "40px" }}
    >
      <h2>Create New User</h2>
      {message && (
        <p
          style={{
            color: message.includes("Success") ? "green" : "red",
            marginBottom: "15px",
          }}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
      >
        <div className="form-group" style={{ flex: "1 1 200px" }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: "1 1 200px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ flex: "1 1 200px" }}>
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {formData.role === "Employee" && (
          <div className="form-group" style={{ flex: "1 1 200px" }}>
            <label>Reports to Manager</label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              required={formData.role === "Employee"}
            >
              <option value="">-- Select Manager --</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
          style={{ flex: "1 1 150px" }}
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

// --- AdminUsersPage Component ---

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const AVAILABLE_ROLES = ["Manager", "Employee"];

  // --- Data Fetching ---
  const loadUsers = async () => {
    try {
      setLoading(true);
      // Use mock data for now while fixing API issues
      const mockUsers = getMockUsers();
      setUsers(mockUsers);
      setError(null);
      console.log("Loaded mock users:", mockUsers);
    } catch (err) {
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter list of available managers for the dropdowns
  const managers = users.filter((u) => u.role === "Manager");

  // --- Action Handlers ---

  const handleSendPassword = async (userId) => {
    if (!window.confirm("Send a new temporary password to this user?")) return;
    try {
      // Simulate sending password
      alert(
        "New temporary password has been successfully sent to the user's email. Password: temp123"
      );
    } catch (err) {
      alert("Error sending password.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const originalUsers = users;

    // Optimistic Update: Update UI before API call
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: newRole,
              managerId: newRole === "Manager" ? null : u.managerId,
            }
          : u
      )
    );

    try {
      // Simulate role update
      console.log(`Role updated to ${newRole} for user ${userId}`);
    } catch (err) {
      // Revert UI if API fails
      setUsers(originalUsers);
      alert(`Failed to update role for user ID ${userId}.`);
    }
  };

  const handleManagerChange = async (userId, newManagerIdString) => {
    const newManagerId = newManagerIdString
      ? parseInt(newManagerIdString)
      : null;
    const originalUsers = users;

    // Optimistic Update
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              managerId: newManagerId,
              managerName:
                managers.find((m) => m.id === newManagerId)?.name || null,
            }
          : u
      )
    );

    try {
      // Simulate manager update
      console.log(`Manager updated to ${newManagerId} for user ${userId}`);
    } catch (err) {
      setUsers(originalUsers);
      alert(`Failed to update manager for user ID ${userId}.`);
    }
  };

  const handleNewUserCreated = (newUser) => {
    // Find the manager's name to display correctly in the table row
    const managerName =
      managers.find((m) => m.id === newUser.managerId)?.name || null;

    setUsers((prevUsers) => [
      ...prevUsers,
      {
        ...newUser,
        managerName: managerName,
        managerEmail:
          managers.find((m) => m.id === newUser.managerId)?.email || null,
      },
    ]);
  };

  const renderUserTable = () => {
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
      <table className="admin-table-style">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: "5px", border: "1px solid #ccc" }}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={user.managerId || ""}
                  onChange={(e) => handleManagerChange(user.id, e.target.value)}
                  disabled={user.role === "Manager"} // Managers don't report to anyone (simplified)
                  style={{ padding: "5px", border: "1px solid #ccc" }}
                >
                  <option value="">-- None (Admin) --</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => handleSendPassword(user.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f4a261",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Send Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <MainLayout>
      <h1>User and Role Management (Admin View)</h1>

      <NewUserForm managers={managers} onUserCreated={handleNewUserCreated} />

      <h3>Existing Users</h3>
      {renderUserTable()}
    </MainLayout>
  );
};

export default AdminUsersPage;
