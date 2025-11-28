import express from 'express';
import {
  createComplain,
  getComplains,
  getComplainById,
  deleteComplain,
} from '../Controllers/complain.controller.js';
// import { verifyToken, isAdmin, isTeacher, isStudent } from '../../../utils/authMiddleware'; // Assuming auth middleware

const router = express.Router();

// @route   POST /api/institute/communication/complains/create
// @desc    Create a new complaint
// @access  Private (Student, Teacher, Employee)
router.post('/create', createComplain);

// @route   GET /api/institute/communication/complains
// @desc    Get all complaints
// @access  Private (Admin, Teacher)
router.get('/', getComplains);

// @route   GET /api/institute/communication/complains/:id
// @desc    Get a single complaint by ID
router.get('/:id', getComplainById);

// @route   DELETE /api/institute/communication/complains/:id
// @desc    Delete a complaint
// @access  Private (Admin)
router.delete('/:id', deleteComplain);

export default router;

