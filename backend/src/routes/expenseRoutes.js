import express from "express";
import { submitExpense, getMyExpenses, getPendingExpenses, approveExpense } from "../controllers/expenseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee routes
router.post("/expenses", authMiddleware, submitExpense);
router.get("/expenses/my", authMiddleware, getMyExpenses);

// Manager/Admin routes
router.get("/expenses/pending", authMiddleware, getPendingExpenses);
router.post("/expenses/approve", authMiddleware, approveExpense);

export default router;
