import express from 'express';
import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from '../Controllers/notice.controller.js';
import { authMiddleware } from '../../../Middlewares/Authorization.middleware.js';

const router = express.Router();

// @route   POST /api/institute/communication/notices/create
// @desc    Create a new notice
// @access  Private (Admin, Teacher)
router.post('/create', authMiddleware(["admin", "communicationManagement"], ["institute"]), createNotice);

// @route   GET /api/institute/communication/notices
// @desc    Get all notices
// @access  Private (Admin, Teacher, Student)
router.get('/', authMiddleware(["admin", "communicationManagement"], ["institute"]), getNotices);

// @route   GET /api/institute/communication/notices/:id
// @desc    Get a single notice by ID
router.get('/:id', getNoticeById);

// @route   PUT /api/institute/communication/notices/:id
// @desc    Update a notice
router.put('/:id', updateNotice);

// @route   DELETE /api/institute/communication/notices/:id
// @desc    Delete a notice
router.delete('/:id', deleteNotice);

export default router;

