import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuthStore } from "../hooks/useAuthStore";
import {
  fetchApprovalRules,
  createApprovalRule,
  updateApprovalRule,
  deleteApprovalRule,
} from "../services/apiService";
import { getMockApprovalRules } from "../services/mockDataService";

const ApprovalRulesPage = () => {
  const { user } = useAuthStore();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ruleType: "percentage", // percentage, specific_approver, hybrid
    percentage: 60,
    specificApprover: "",
    approvers: [],
    conditions: {
      amountThreshold: "",
      category: "",
      department: "",
    },
    isActive: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      // Use comprehensive mock data service
      const mockRules = getMockApprovalRules();
      setRules(mockRules);
    } catch (error) {
      setMessage("Failed to load approval rules.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingRule) {
        await updateApprovalRule(editingRule.id, formData);
        setMessage("Approval rule updated successfully!");
      } else {
        await createApprovalRule(formData);
        setMessage("Approval rule created successfully!");
      }

      await loadRules();
      resetForm();
    } catch (error) {
      setMessage("Failed to save approval rule.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      percentage: rule.percentage || 60,
      specificApprover: rule.specificApprover || "",
      approvers: rule.approvers || [],
      conditions: rule.conditions,
      isActive: rule.isActive,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this approval rule?"))
      return;

    try {
      await deleteApprovalRule(ruleId);
      setMessage("Approval rule deleted successfully!");
      await loadRules();
    } catch (error) {
      setMessage("Failed to delete approval rule.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      ruleType: "percentage",
      percentage: 60,
      specificApprover: "",
      approvers: [],
      conditions: {
        amountThreshold: "",
        category: "",
        department: "",
      },
      isActive: true,
    });
    setEditingRule(null);
    setShowCreateForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("conditions.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const getRuleTypeLabel = (ruleType) => {
    switch (ruleType) {
      case "percentage":
        return "Percentage Rule";
      case "specific_approver":
        return "Specific Approver";
      case "hybrid":
        return "Hybrid Rule";
      default:
        return ruleType;
    }
  };

  const getConditionText = (rule) => {
    const conditions = [];
    if (rule.conditions.amountThreshold > 0) {
      conditions.push(`Amount > $${rule.conditions.amountThreshold}`);
    }
    if (rule.conditions.category !== "all") {
      conditions.push(`Category: ${rule.conditions.category}`);
    }
    if (rule.conditions.department !== "all") {
      conditions.push(`Department: ${rule.conditions.department}`);
    }
    return conditions.length > 0 ? conditions.join(", ") : "All expenses";
  };

  if (loading && rules.length === 0) {
    return (
      <MainLayout>
        <div className="loading-spinner">Loading approval rules...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="approval-rules">
        <div className="page-header">
          <h1>Approval Rules Configuration</h1>
          <button
            className="action-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Create New Rule
          </button>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>
                  {editingRule
                    ? "Edit Approval Rule"
                    : "Create New Approval Rule"}
                </h3>
                <button className="close-btn" onClick={resetForm}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="rule-form">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Rule Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Rule Type</h4>
                  <div className="form-group">
                    <label>Rule Type</label>
                    <select
                      name="ruleType"
                      value={formData.ruleType}
                      onChange={handleChange}
                      required
                    >
                      <option value="percentage">Percentage Rule</option>
                      <option value="specific_approver">
                        Specific Approver
                      </option>
                      <option value="hybrid">Hybrid Rule</option>
                    </select>
                  </div>

                  {formData.ruleType === "percentage" && (
                    <div className="form-group">
                      <label>Percentage Required</label>
                      <input
                        type="number"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  )}

                  {formData.ruleType === "specific_approver" && (
                    <div className="form-group">
                      <label>Specific Approver</label>
                      <select
                        name="specificApprover"
                        value={formData.specificApprover}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Approver</option>
                        <option value="Manager">Manager</option>
                        <option value="Finance">Finance</option>
                        <option value="Director">Director</option>
                        <option value="CEO">CEO</option>
                      </select>
                    </div>
                  )}

                  {formData.ruleType === "hybrid" && (
                    <>
                      <div className="form-group">
                        <label>Percentage Required</label>
                        <input
                          type="number"
                          name="percentage"
                          value={formData.percentage}
                          onChange={handleChange}
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>OR Specific Approver</label>
                        <select
                          name="specificApprover"
                          value={formData.specificApprover}
                          onChange={handleChange}
                        >
                          <option value="">Select Approver</option>
                          <option value="Manager">Manager</option>
                          <option value="Finance">Finance</option>
                          <option value="Director">Director</option>
                          <option value="CEO">CEO</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-section">
                  <h4>Conditions</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Amount Threshold</label>
                      <input
                        type="number"
                        name="conditions.amountThreshold"
                        value={formData.conditions.amountThreshold}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="conditions.category"
                        value={formData.conditions.category}
                        onChange={handleChange}
                      >
                        <option value="all">All Categories</option>
                        <option value="Travel">Travel</option>
                        <option value="Meals & Entertainment">
                          Meals & Entertainment
                        </option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Transportation">Transportation</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingRule
                      ? "Update Rule"
                      : "Create Rule"}
                  </button>
                  <button
                    type="button"
                    className="action-btn cancel"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div className="rules-list">
          {rules.length === 0 ? (
            <div className="empty-state">
              <p>
                No approval rules configured. Create your first rule to get
                started.
              </p>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="rule-card">
                <div className="rule-header">
                  <div className="rule-info">
                    <h3>{rule.name}</h3>
                    <p className="rule-description">{rule.description}</p>
                  </div>
                  <div className="rule-status">
                    <span
                      className={`status ${
                        rule.isActive ? "active" : "inactive"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="rule-details">
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">
                      {getRuleTypeLabel(rule.ruleType)}
                    </span>
                  </div>

                  {rule.ruleType === "percentage" && (
                    <div className="detail-row">
                      <span className="label">Percentage:</span>
                      <span className="value">{rule.percentage}%</span>
                    </div>
                  )}

                  {rule.ruleType === "specific_approver" && (
                    <div className="detail-row">
                      <span className="label">Approver:</span>
                      <span className="value">{rule.specificApprover}</span>
                    </div>
                  )}

                  {rule.ruleType === "hybrid" && (
                    <div className="detail-row">
                      <span className="label">Percentage:</span>
                      <span className="value">
                        {rule.percentage}% OR {rule.specificApprover}
                      </span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="label">Conditions:</span>
                    <span className="value">{getConditionText(rule)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Created:</span>
                    <span className="value">{rule.createdAt}</span>
                  </div>
                </div>

                <div className="rule-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleEdit(rule)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => handleDelete(rule.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ApprovalRulesPage;
