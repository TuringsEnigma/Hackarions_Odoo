import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Employee: Submit Expense
export const submitExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;
    const user_id = req.user.user_id;
    const company_id = req.user.company_id;

    const expenseId = uuidv4();

    await db.execute(
      `INSERT INTO Expenses (expense_id, user_id, company_id, amount, currency, category, description, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [expenseId, user_id, company_id, amount, currency, category, description, date]
    );

    res.status(201).json({ message: "Expense submitted", expense_id: expenseId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employee: View own expenses
export const getMyExpenses = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const [rows] = await db.execute(
      `SELECT * FROM Expenses WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: View pending approvals
export const getPendingExpenses = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const [rows] = await db.execute(
      `SELECT e.*, u.email as employee_email 
       FROM Expenses e
       JOIN Users u ON e.user_id = u.user_id
       JOIN ExpenseApprovals ea ON e.expense_id = ea.expense_id
       WHERE ea.approver_id = ? AND ea.approved IS NULL
       ORDER BY e.created_at DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: Approve or Reject
export const approveExpense = async (req, res) => {
  try {
    const { expense_id, approved, comments } = req.body;
    const approver_id = req.user.user_id;

    // Update approval step
    await db.execute(
      `UPDATE ExpenseApprovals
       SET approved = ?, comments = ?, approved_at = NOW()
       WHERE expense_id = ? AND approver_id = ?`,
      [approved, comments, expense_id, approver_id]
    );

    // Check if all steps approved
    const [pendingSteps] = await db.execute(
      `SELECT * FROM ExpenseApprovals WHERE expense_id = ? AND approved IS NULL`,
      [expense_id]
    );

    if (pendingSteps.length === 0) {
      // If no pending, update expense status
      const [rejectedSteps] = await db.execute(
        `SELECT * FROM ExpenseApprovals WHERE expense_id = ? AND approved = 0`,
        [expense_id]
      );
      const status = rejectedSteps.length > 0 ? "rejected" : "approved";
      await db.execute(`UPDATE Expenses SET status = ? WHERE expense_id = ?`, [status, expense_id]);
    }

    res.json({ message: "Approval processed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
