import express from 'express';
import {
  createSalary,
  getSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary,
} from '../Controllers/Salary.controller.js';
// import { verifyToken, isAdmin, isAccountant } from '../../../utils/authMiddleware';

const router = express.Router();

// @route   POST /api/institute/finance/salaries/create
// @desc    Create a new salary record
// @access  Private (Admin/Accountant)
router.post('/create', createSalary);

// @route   GET /api/institute/finance/salaries
// @desc    Get all salary records
// @access  Private (Admin/Accountant)
router.get('/', getSalaries);

// @route   GET /api/institute/finance/salaries/:id
// @desc    Get a single salary record by ID
// @access  Private (Admin/Accountant/Employee)
router.get('/:id', getSalaryById);

// @route   PUT /api/institute/finance/salaries/:id
// @desc    Update a salary record
// @access  Private (Admin/Accountant)
router.put('/:id', updateSalary);

// @route   DELETE /api/institute/finance/salaries/:id
// @desc    Delete a salary record
// @access  Private (Admin)
router.delete('/:id', deleteSalary);

export default router;
