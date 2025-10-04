import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuthStore } from "../hooks/useAuthStore";
import { getMockApprovalQueue } from "../services/mockDataService";

const ApprovalQueuePage = () => {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");

  // Mock data - would be replaced with actual API calls
  const mockExpenses = [
    {
      id: 1,
      employeeName: "John Doe",
      amount: 150.0,
      currency: "USD",
      category: "Travel",
      description: "Flight to client meeting",
      date: "2024-01-15",
      status: "pending",
      currentApprover: user?.role === "Manager" ? "Manager" : "Finance",
      approvalLevel: 1,
      totalLevels: 3,
      submittedDate: "2024-01-14",
      receipt: "receipt_001.pdf",
      approvalHistory: [
        {
          approver: "Manager",
          status: "approved",
          date: "2024-01-14",
          comment: "Approved for client meeting",
        },
      ],
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      amount: 75.5,
      currency: "EUR",
      category: "Meals & Entertainment",
      description: "Business dinner with client",
      date: "2024-01-13",
      status: "pending",
      currentApprover: user?.role === "Manager" ? "Manager" : "Finance",
      approvalLevel: 1,
      totalLevels: 2,
      submittedDate: "2024-01-12",
      receipt: "receipt_002.pdf",
      approvalHistory: [],
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      amount: 500.0,
      currency: "USD",
      category: "Office Supplies",
      description: "Laptop for new employee",
      date: "2024-01-12",
      status: "pending",
      currentApprover: "Director",
      approvalLevel: 3,
      totalLevels: 3,
      submittedDate: "2024-01-11",
      receipt: "receipt_003.pdf",
      approvalHistory: [
        {
          approver: "Manager",
          status: "approved",
          date: "2024-01-11",
          comment: "Necessary equipment",
        },
        {
          approver: "Finance",
          status: "approved",
          date: "2024-01-12",
          comment: "Budget approved",
        },
      ],
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

  const handleApprove = async (expenseId) => {
    setActionLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Approving expense:", expenseId, "with comment:", comment);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseId
            ? {
                ...expense,
                status:
                  expense.approvalLevel >= expense.totalLevels
                    ? "approved"
                    : "pending",
                approvalLevel: expense.approvalLevel + 1,
                approvalHistory: [
                  ...expense.approvalHistory,
                  {
                    approver: user?.role,
                    status: "approved",
                    date: new Date().toISOString().split("T")[0],
                    comment: comment,
                  },
                ],
              }
            : expense
        )
      );

      setComment("");
      setSelectedExpense(null);
    } catch (error) {
      console.error("Failed to approve expense:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (expenseId) => {
    setActionLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Rejecting expense:", expenseId, "with comment:", comment);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseId
            ? {
                ...expense,
                status: "rejected",
                approvalHistory: [
                  ...expense.approvalHistory,
                  {
                    approver: user?.role,
                    status: "rejected",
                    date: new Date().toISOString().split("T")[0],
                    comment: comment,
                  },
                ],
              }
            : expense
        )
      );

      setComment("");
      setSelectedExpense(null);
    } catch (error) {
      console.error("Failed to reject expense:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === "all") return true;
    if (filter === "pending") return expense.status === "pending";
    if (filter === "my-approvals")
      return expense.currentApprover === user?.role;
    return true;
  });

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

  const getApprovalProgress = (expense) => {
    return `${expense.approvalLevel}/${expense.totalLevels}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-spinner">Loading approval queue...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="approval-queue">
        <div className="page-header">
          <h1>Expense Approval Queue</h1>
          <div className="filter-tabs">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Expenses
            </button>
            <button
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={filter === "my-approvals" ? "active" : ""}
              onClick={() => setFilter("my-approvals")}
            >
              My Approvals
            </button>
          </div>
        </div>

        <div className="expenses-list">
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses found for the selected filter.</p>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="expense-card">
                <div className="expense-header">
                  <div className="expense-info">
                    <h3>{expense.description}</h3>
                    <p className="employee-name">by {expense.employeeName}</p>
                  </div>
                  <div className="expense-amount">
                    <span className="amount">${expense.amount}</span>
                    <span className="currency">{expense.currency}</span>
                  </div>
                </div>

                <div className="expense-details">
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span className="value">{expense.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{expense.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span
                      className={`status status-${getStatusColor(
                        expense.status
                      )}`}
                    >
                      {expense.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Approval Progress:</span>
                    <span className="value">
                      {getApprovalProgress(expense)} levels
                    </span>
                  </div>
                  {expense.currentApprover && (
                    <div className="detail-row">
                      <span className="label">Current Approver:</span>
                      <span className="value">{expense.currentApprover}</span>
                    </div>
                  )}
                </div>

                {expense.approvalHistory.length > 0 && (
                  <div className="approval-history">
                    <h4>Approval History</h4>
                    {expense.approvalHistory.map((history, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <span className="approver">{history.approver}</span>
                          <span
                            className={`status status-${getStatusColor(
                              history.status
                            )}`}
                          >
                            {history.status.toUpperCase()}
                          </span>
                          <span className="date">{history.date}</span>
                        </div>
                        {history.comment && (
                          <p className="comment">{history.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {expense.status === "pending" &&
                  expense.currentApprover === user?.role && (
                    <div className="expense-actions">
                      <button
                        className="action-btn approve"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        Reject
                      </button>
                      <button className="action-btn view-receipt">
                        View Receipt
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>

        {/* Approval Modal */}
        {selectedExpense && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>
                  {selectedExpense.status === "pending" ? "Approve" : "Reject"}{" "}
                  Expense
                </h3>
                <button
                  className="close-btn"
                  onClick={() => setSelectedExpense(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="expense-summary">
                  <p>
                    <strong>Description:</strong> {selectedExpense.description}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${selectedExpense.amount}{" "}
                    {selectedExpense.currency}
                  </p>
                  <p>
                    <strong>Employee:</strong> {selectedExpense.employeeName}
                  </p>
                </div>
                <div className="comment-section">
                  <label htmlFor="approval-comment">Comment (Optional)</label>
                  <textarea
                    id="approval-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment about your decision..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="action-btn approve"
                  onClick={() => handleApprove(selectedExpense.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  className="action-btn reject"
                  onClick={() => handleReject(selectedExpense.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Reject"}
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => setSelectedExpense(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ApprovalQueuePage;
