import Expense from '../Models/Expense.model.js';
import { errorHandler } from '../../../Utils/Error.js';
import { nanoid } from 'nanoid';

/**
 * @desc    Create a new expense
 * @route   POST /api/institute/finance/expenses/create
 * @access  Private (Admin/Accountant)
 */
export const createExpense = async (req, res, next) => {
  const { instituteId, title, description, amount, category, expenseDate, receiptUrl } = req.body;
  const paidBy = req.user.employeeId; // Assuming the logged-in user is the one paying

  if (!instituteId || !title || !amount || !category || !paidBy) {
    return next(errorHandler(400, 'Institute ID, title, amount, category, and paidBy are required.'));
  }

  try {
    const expenseId = `EXP-${nanoid(10)}`;
    const newExpense = new Expense({
      expenseId,
      instituteId,
      title,
      description,
      amount,
      category,
      expenseDate: expenseDate || new Date(),
      paidBy,
      receiptUrl,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({
      success: true,
      message: 'Expense created successfully.',
      data: savedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all expenses with filtering and pagination
 * @route   GET /api/institute/finance/expenses
 * @access  Private (Admin/Accountant)
 */
export const getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, instituteId, category, search } = req.query;

    const filter = { instituteId };
    if (category) filter.category = category;

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const expenses = await Expense.find(filter)
      .sort({ expenseDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalExpenses = await Expense.countDocuments(filter);
    const totalPages = Math.ceil(totalExpenses / limitNum);

    res.status(200).json({
      success: true,
      message: 'Expenses retrieved successfully.',
      data: {
        expenses,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalExpenses,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an expense
 * @route   PUT /api/institute/finance/expenses/:id
 * @access  Private (Admin/Accountant)
 */
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findOneAndUpdate(
      { expenseId: id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return next(errorHandler(404, 'Expense not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully.',
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/institute/finance/expenses/:id
 * @access  Private (Admin)
 */
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findOneAndDelete({ expenseId: id });

    if (!deletedExpense) {
      return next(errorHandler(404, 'Expense not found.'));
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

