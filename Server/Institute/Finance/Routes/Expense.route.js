import express from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../Controllers/Expense.controller.js';
// import { verifyToken, isAdmin } from '../../../utils/authMiddleware'; // Assuming auth middleware

const router = express.Router();

// @route   POST /api/institute/finance/expenses/create
// @desc    Create a new expense
// @access  Private (Admin/Accountant)
router.post('/create', createExpense);

// @route   GET /api/institute/finance/expenses
// @desc    Get all expenses
// @access  Private (Admin/Accountant)
router.get('/', getExpenses);

// @route   PUT /api/institute/finance/expenses/:id
// @desc    Update an expense
// @access  Private (Admin/Accountant)
router.put('/:id', updateExpense);

// @route   DELETE /api/institute/finance/expenses/:id
// @desc    Delete an expense
// @access  Private (Admin)
router.delete('/:id', deleteExpense);

export default router;

