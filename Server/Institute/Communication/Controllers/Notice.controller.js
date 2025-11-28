import Communication from '../Models/Communication.model.js';
import { errorHandler } from '../../../Utils/Error.js';
import { nanoid } from 'nanoid';

/**
 * @desc    Create a new notice
 * @route   POST /api/institute/communication/notices
 * @access  Private (Admin, Teacher)
 */
export const createNotice = async (req, res, next) => {
  const { instituteId, userId } = req.user;
  const {
    title,
    content,
    type,
    priority,
    targetAudience,
    publishDate,
    expiryDate,
    publishedBy,
  } = req.body;

  if (!instituteId || !title || !content) {
    return next(
      errorHandler(400, 'Institute ID, title, and message are required.')
    );
  }

  try {
    const communicationId = `NOTICE-${nanoid(10)}`;

    const newNotice = new Communication({
      communicationId,
      instituteId,
      title,
      content,
      type: type || 'notice', // Default type
      priority: priority || 'normal',
      targetAudience: targetAudience || 'all',
      publishDate: publishDate || new Date(),
      expiryDate: expiryDate || null,
      publishedBy,
      creatorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedNotice = await newNotice.save();

    res.status(201).json({
      success: true,
      message: 'Notice created successfully.',
      data: savedNotice,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Failed to create notice.'));
  }
};

/**
 * @desc    Get all notices with filtering and pagination
 * @route   GET /api/institute/communication/notices
 * @access  Private (Admin, Teacher, Student)
 */
export const getNotices = async (req, res, next) => {
  try {
    const {instituteId} = req.user

    const notices = await Communication.find({instituteId})

    res.status(200).json({
      success: true,
      message: 'Notices retrieved successfully.',
      data: {
        notices,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single notice by ID
 * @route   GET /api/institute/communication/notices/:id
 * @access  Private (Admin, Teacher, Student)
 */
export const getNoticeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await Communication.findOne({ communicationId: id, type: 'notice' });

    if (!notice) {
      return next(errorHandler(404, 'Notice not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Notice retrieved successfully.',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a notice
 * @route   PUT /api/institute/communication/notices/:id
 * @access  Private (Admin, Teacher)
 */
export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, programId, batchId, subjectId } = req.body;

    const updatedNotice = await Communication.findOneAndUpdate(
      { communicationId: id, type: 'notice' },
      { title, message, programId, batchId, subjectId },
      { new: true, runValidators: true }
    );

    if (!updatedNotice) {
      return next(errorHandler(404, 'Notice not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully.',
      data: updatedNotice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a notice
 * @route   DELETE /api/institute/communication/notices/:id
 * @access  Private (Admin, Teacher)
 */
export const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Communication.findOneAndDelete({ communicationId: id, type: 'notice' });

    if (!deletedNotice) {
      return next(errorHandler(404, 'Notice not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

