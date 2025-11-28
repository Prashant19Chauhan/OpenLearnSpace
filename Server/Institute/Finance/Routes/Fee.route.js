import express from 'express';
import {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getPendingFees,
  createBatchFee
} from '../Controllers/Fee.controller.js';
// import { verifyToken, isAdmin, isAccountant } from '../../../utils/authMiddleware'; // Assuming auth middleware

const router = express.Router();

// @route   POST /api/institute/finance/fees/create
// @desc    Create a new fee record for a single student
// @access  Private (Admin/Accountant)
router.post('/create', createFee);

// @route   POST /api/institute/finance/fees/batch
// @desc    Create fee records for all students in a batch
// @access  Private (Admin/Accountant)
router.post('/batch', createBatchFee);

// @route   GET /api/institute/finance/fees
// @desc    Get all fee records with filtering and pagination
// @access  Private (Admin/Accountant)
router.get('/', getFees);

// @route   GET /api/institute/finance/fees/pending
// @desc    Get all pending fees for an institute
// @access  Private (Admin/Accountant)
router.get('/pending', getPendingFees);

// @route   GET /api/institute/finance/fees/:id
// @desc    Get a single fee record by ID
// @access  Private (Admin/Accountant/Student)
router.get('/:id', getFeeById);

// @route   PUT /api/institute/finance/fees/:id
// @desc    Update a fee record (e.g., record a payment)
// @access  Private (Admin/Accountant)
router.put('/:id', updateFee);

// @route   DELETE /api/institute/finance/fees/:id
// @desc    Delete a fee record
// @access  Private (Admin)
router.delete('/:id', deleteFee);

export default router;
