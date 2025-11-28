import Communication from '../Models/Communication.model.js';
import { errorHandler } from '../../../Utils/Error.js';
import { nanoid } from 'nanoid';

/**
 * @desc    Create a new complain
 * @route   POST /api/institute/communication/complains
 * @access  Private (Student, Teacher, Employee)
 */
export const createComplain = async (req, res, next) => {
  const { instituteId, title, message, studentId, teacherId, employeeId } = req.body;

  if (!instituteId || !title || !message) {
    return next(errorHandler(400, 'Institute ID, title, and message are required.'));
  }

  // Ensure at least one sender ID is provided
  if (!studentId && !teacherId && !employeeId) {
    return next(errorHandler(400, 'A studentId, teacherId, or employeeId is required to create a complaint.'));
  }

  try {
    const communicationId = `COMPLAIN-${nanoid(10)}`;
    const newComplain = new Communication({
      communicationId,
      instituteId,
      type: 'complain',
      title,
      message,
      studentId,
      teacherId,
      employeeId,
    });

    const savedComplain = await newComplain.save();
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: savedComplain,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complains with filtering and pagination
 * @route   GET /api/institute/communication/complains
 * @access  Private (Admin, Teacher)
 */
export const getComplains = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, instituteId, programId, batchId, subjectId, search } = req.query;

    const filter = { type: 'complain' };
    if (instituteId) filter.instituteId = instituteId;
    if (programId) filter.programId = programId;
    if (batchId) filter.batchId = batchId;
    if (subjectId) filter.subjectId = subjectId;

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const complains = await Communication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalComplains = await Communication.countDocuments(filter);
    const totalPages = Math.ceil(totalComplains / limitNum);

    res.status(200).json({
      success: true,
      message: 'Complaints retrieved successfully.',
      data: {
        complains,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalComplains,
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
 * @desc    Get a single complain by ID
 * @route   GET /api/institute/communication/complains/:id
 * @access  Private (Admin, Teacher)
 */
export const getComplainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complain = await Communication.findOne({ communicationId: id, type: 'complain' });

    if (!complain) {
      return next(errorHandler(404, 'Complaint not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Complaint retrieved successfully.',
      data: complain,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a complain
 * @route   DELETE /api/institute/communication/complains/:id
 * @access  Private (Admin)
 */
export const deleteComplain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedComplain = await Communication.findOneAndDelete({ communicationId: id, type: 'complain' });

    if (!deletedComplain) {
      return next(errorHandler(404, 'Complaint not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

