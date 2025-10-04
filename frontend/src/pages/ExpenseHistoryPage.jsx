import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuthStore } from "../hooks/useAuthStore";
import {
  getMockExpenseHistory,
  getMockExpenseCategories,
} from "../services/mockDataService";

const ExpenseHistoryPage = () => {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    dateRange: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock data - would be replaced with actual API calls
  const mockExpenses = [
    {
      id: 1,
      amount: 150.0,
      currency: "USD",
      category: "Travel",
      description: "Flight to client meeting",
      date: "2024-01-15",
      status: "approved",
      submittedDate: "2024-01-14",
      approvedDate: "2024-01-16",
      approvedBy: "Manager",
      receipt: "receipt_001.pdf",
      approvalComments: "Approved for client meeting",
    },
    {
      id: 2,
      amount: 75.5,
      currency: "EUR",
      category: "Meals & Entertainment",
      description: "Business dinner with client",
      date: "2024-01-13",
      status: "pending",
      submittedDate: "2024-01-12",
      approvedDate: null,
      approvedBy: null,
      receipt: "receipt_002.pdf",
      approvalComments: null,
    },
    {
      id: 3,
      amount: 45.0,
      currency: "USD",
      category: "Transportation",
      description: "Taxi fare to airport",
      date: "2024-01-10",
      status: "rejected",
      submittedDate: "2024-01-09",
      approvedDate: "2024-01-11",
      approvedBy: "Manager",
      receipt: "receipt_003.pdf",
      approvalComments: "Personal expense, not business related",
    },
    {
      id: 4,
      amount: 200.0,
      currency: "USD",
      category: "Office Supplies",
      description: "Laptop accessories",
      date: "2024-01-08",
      status: "approved",
      submittedDate: "2024-01-07",
      approvedDate: "2024-01-09",
      approvedBy: "Finance",
      receipt: "receipt_004.pdf",
      approvalComments: "Necessary equipment for work",
    },
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setExpenses(mockExpenses);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getFilteredAndSortedExpenses = () => {
    let filtered = expenses.filter((expense) => {
      // Status filter
      if (filters.status !== "all" && expense.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        const daysDiff = Math.floor(
          (now - expenseDate) / (1000 * 60 * 60 * 24)
        );

        switch (filters.dateRange) {
          case "last7days":
            if (daysDiff > 7) return false;
            break;
          case "last30days":
            if (daysDiff > 30) return false;
            break;
          case "last90days":
            if (daysDiff > 90) return false;
            break;
        }
      }

      // Search filter
      if (
        filters.search &&
        !expense.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.submittedDate);
          bValue = new Date(b.submittedDate);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "❓";
    }
  };

  const categories = [
    "Travel",
    "Meals & Entertainment",
    "Office Supplies",
    "Transportation",
    "Accommodation",
    "Communication",
    "Training",
    "Other",
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-spinner">Loading expense history...</div>
      </MainLayout>
    );
  }

  const filteredExpenses = getFilteredAndSortedExpenses();

  return (
    <MainLayout>
      <div className="expense-history">
        <div className="page-header">
          <h1>My Expense History</h1>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Submitted:</span>
              <span className="stat-value">{expenses.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Approved:</span>
              <span className="stat-value approved">
                {expenses.filter((e) => e.status === "approved").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value pending">
                {expenses.filter((e) => e.status === "pending").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rejected:</span>
              <span className="stat-value rejected">
                {expenses.filter((e) => e.status === "rejected").length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range:</label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
              >
                <option value="all">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                placeholder="Search descriptions..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="sort-section">
          <div className="sort-options">
            <span>Sort by:</span>
            <button
              className={sortBy === "date" ? "active" : ""}
              onClick={() => handleSort("date")}
            >
              Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={sortBy === "amount" ? "active" : ""}
              onClick={() => handleSort("amount")}
            >
              Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={sortBy === "status" ? "active" : ""}
              onClick={() => handleSort("status")}
            >
              Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={sortBy === "category" ? "active" : ""}
              onClick={() => handleSort("category")}
            >
              Category{" "}
              {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="expenses-list">
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses found matching your filters.</p>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="expense-card">
                <div className="expense-header">
                  <div className="expense-info">
                    <h3>{expense.description}</h3>
                    <p className="expense-date">{expense.date}</p>
                  </div>
                  <div className="expense-amount">
                    <span className="amount">${expense.amount}</span>
                    <span className="currency">{expense.currency}</span>
                  </div>
                  <div className="expense-status">
                    <span
                      className={`status status-${getStatusColor(
                        expense.status
                      )}`}
                    >
                      {getStatusIcon(expense.status)}{" "}
                      {expense.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="expense-details">
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span className="value">{expense.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Submitted:</span>
                    <span className="value">{expense.submittedDate}</span>
                  </div>
                  {expense.approvedDate && (
                    <div className="detail-row">
                      <span className="label">Approved:</span>
                      <span className="value">
                        {expense.approvedDate} by {expense.approvedBy}
                      </span>
                    </div>
                  )}
                  {expense.approvalComments && (
                    <div className="detail-row">
                      <span className="label">Comments:</span>
                      <span className="value">{expense.approvalComments}</span>
                    </div>
                  )}
                </div>

                <div className="expense-actions">
                  <button className="action-btn view-receipt">
                    📄 View Receipt
                  </button>
                  {expense.status === "rejected" && (
                    <button className="action-btn resubmit">🔄 Resubmit</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExpenseHistoryPage;
