import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuthStore } from "../hooks/useAuthStore";
import { fetchCountriesWithCurrency } from "../services/countryService";
import {
  getMockExpenseCategories,
  getMockOCRResults,
  getMockCurrencyData,
} from "../services/mockDataService";

const ExpenseSubmissionPage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    receipt: null,
    receiptText: "",
  });
  const [countries, setCountries] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const expenseCategories = [
    "Travel",
    "Meals & Entertainment",
    "Office Supplies",
    "Transportation",
    "Accommodation",
    "Communication",
    "Training",
    "Other",
  ];

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (formData.amount && formData.currency && user?.companyCurrency) {
      convertCurrency();
    }
  }, [formData.amount, formData.currency, user?.companyCurrency]);

  const loadCountries = async () => {
    try {
      const countryData = await fetchCountriesWithCurrency();
      setCountries(countryData);
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  };

  const convertCurrency = async () => {
    if (formData.currency === user?.companyCurrency) {
      setConvertedAmount(parseFloat(formData.amount));
      return;
    }

    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${formData.currency}`
      );
      const data = await response.json();
      const rate = data.rates[user?.companyCurrency];
      const converted = parseFloat(formData.amount) * rate;
      setConvertedAmount(converted);
    } catch (error) {
      console.error("Currency conversion failed:", error);
      setConvertedAmount(null);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, receipt: file });
      // Simulate OCR processing
      simulateOCR(file);
    }
  };

  const simulateOCR = (file) => {
    setLoading(true);
    // This would be replaced with actual OCR API call
    setTimeout(() => {
      const mockOCRResult = {
        amount: "45.50",
        date: "2024-01-15",
        description: "Business Lunch - Restaurant ABC",
        category: "Meals & Entertainment",
      };

      setFormData((prev) => ({
        ...prev,
        amount: mockOCRResult.amount,
        date: mockOCRResult.date,
        description: mockOCRResult.description,
        category: mockOCRResult.category,
        receiptText: `OCR Result: ${mockOCRResult.description} - $${mockOCRResult.amount}`,
      }));
      setLoading(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // TODO: Implement actual API call to submit expense
      const expenseData = {
        ...formData,
        convertedAmount: convertedAmount,
        companyCurrency: user?.companyCurrency,
        employeeId: user?.id,
      };

      console.log("Submitting expense:", expenseData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("Expense submitted successfully!");
      setFormData({
        amount: "",
        currency: "USD",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        receipt: null,
        receiptText: "",
      });
      setConvertedAmount(null);
    } catch (error) {
      setMessage("Failed to submit expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout>
      <div className="expense-submission">
        <h1>Submit New Expense Claim</h1>

        {message && (
          <div
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="expense-form">
          {/* OCR Receipt Upload */}
          <div className="form-section">
            <h3>📷 Receipt OCR (Optional)</h3>
            <div className="receipt-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="file-input"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="file-upload-label">
                📎 Upload Receipt Image
              </label>
              {formData.receipt && (
                <div className="receipt-preview">
                  <p>📄 {formData.receipt.name}</p>
                  {formData.receiptText && (
                    <div className="ocr-result">
                      <strong>OCR Result:</strong>
                      <p>{formData.receiptText}</p>
                    </div>
                  )}
                </div>
              )}
              {loading && <div className="loading">Processing receipt...</div>}
            </div>
          </div>

          {/* Basic Expense Information */}
          <div className="form-section">
            <h3>💰 Expense Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                >
                  {countries.map((country) => (
                    <option key={country.currency} value={country.currency}>
                      {country.currency} - {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {convertedAmount && (
              <div className="currency-conversion">
                <p>
                  <strong>Converted to {user?.companyCurrency}:</strong>$
                  {convertedAmount.toFixed(2)}
                </p>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the expense..."
                rows="3"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Expense"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ExpenseSubmissionPage;
