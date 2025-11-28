import ExaminationModel from "../Models/Examination.model.js";
import { errorHandler } from "../../../Utils/Error.js";
import { nanoid } from "nanoid";

/**
 * Create a new examination
 * @route POST /api/institute/exam/create
 * @access Private
 */
export const createExamination = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      subjectIds,
      batchId,
      startDate,
      endDate,
      duration,
      totalMarks,
      passingMarks,
      questions,
      access
    } = req.body;

    // Validate required fields
    if (!name || !type || !subjectIds || !batchId || !startDate || !endDate || !duration || !totalMarks || !passingMarks || !questions) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Validate exam type
    const validTypes = ["quiz", "test", "exam", "assignment"];
    if (!validTypes.includes(type)) {
      return next(errorHandler(400, `Invalid exam type. Valid types: ${validTypes.join(", ")}`));
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return next(errorHandler(400, "Invalid date format"));
    }

    // Validate date range
    if (end <= start) {
      return next(errorHandler(400, "End date must be after start date"));
    }

    // Validate marks
    if (passingMarks > totalMarks) {
      return next(errorHandler(400, "Passing marks cannot exceed total marks"));
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return next(errorHandler(400, "Questions must be a non-empty array"));
    }

    // Generate unique exam ID
    const examId = "EXAM-" + nanoid(10);

    const newExam = new ExaminationModel({
      examId,
      name,
      description,
      type,
      subjectIds,
      batchId,
      startDate,
      endDate,
      duration,
      totalMarks,
      passingMarks,
      questions,
      access: access || "private",
      status: "scheduled"
    });

    await newExam.save();

    res.status(201).json({
      success: true,
      message: "Examination created successfully",
      data: newExam
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get all examinations with filters and pagination
 * @route GET /api/institute/exam/list
 * @access Private
 */
export const getAllExaminations = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      batchId, 
      subjectId, 
      status,
      search 
    } = req.query;

    const filter = {};

    // Filter by batch
    if (batchId) {
      filter.batchId = batchId;
    }

    // Filter by subject
    if (subjectId) {
      filter.subjectIds = { $in: [subjectId] };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const exams = await ExaminationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalExams = await ExaminationModel.countDocuments(filter);
    const totalPages = Math.ceil(totalExams / limitNum);

    res.status(200).json({
      success: true,
      message: "Examinations retrieved successfully",
      data: {
        exams,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalExams,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get examination by ID
 * @route GET /api/institute/exam/:examId
 * @access Private
 */
export const getExaminationById = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const exam = await ExaminationModel.findOne({ examId });
    if (!exam) {
      return next(errorHandler(404, "Examination not found"));
    }

    res.status(200).json({
      success: true,
      message: "Examination details retrieved successfully",
      data: exam
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Update examination by ID
 * @route PUT /api/institute/exam/:examId
 * @access Private
 */
export const updateExamination = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const {
      name,
      description,
      type,
      subjectIds,
      batchId,
      startDate,
      endDate,
      duration,
      totalMarks,
      passingMarks,
      questions,
      access,
      status
    } = req.body;

    const exam = await ExaminationModel.findOne({ examId });
    if (!exam) {
      return next(errorHandler(404, "Examination not found"));
    }

    // Update fields if provided
    if (name) exam.name = name;
    if (description) exam.description = description;
    if (type) {
      const validTypes = ["quiz", "test", "exam", "assignment"];
      if (!validTypes.includes(type)) {
        return next(errorHandler(400, `Invalid exam type. Valid types: ${validTypes.join(", ")}`));
      }
      exam.type = type;
    }
    if (subjectIds) exam.subjectIds = subjectIds;
    if (batchId) exam.batchId = batchId;
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start)) {
        return next(errorHandler(400, "Invalid start date format"));
      }
      exam.startDate = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end)) {
        return next(errorHandler(400, "Invalid end date format"));
      }
      if (end <= exam.startDate) {
        return next(errorHandler(400, "End date must be after start date"));
      }
      exam.endDate = end;
    }
    if (duration) {
      if (duration < 1) {
        return next(errorHandler(400, "Duration must be at least 1 minute"));
      }
      exam.duration = duration;
    }
    if (totalMarks) {
      if (totalMarks < 1) {
        return next(errorHandler(400, "Total marks must be at least 1"));
      }
      exam.totalMarks = totalMarks;
    }
    if (passingMarks) {
      if (passingMarks < 1) {
        return next(errorHandler(400, "Passing marks must be at least 1"));
      }
      if (passingMarks > exam.totalMarks) {
        return next(errorHandler(400, "Passing marks cannot exceed total marks"));
      }
      exam.passingMarks = passingMarks;
    }
    if (questions) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return next(errorHandler(400, "Questions must be a non-empty array"));
      }
      exam.questions = questions;
    }
    if (access) exam.access = access;
    if (status) {
      const validStatuses = ["scheduled", "active", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return next(errorHandler(400, `Invalid status. Valid statuses: ${validStatuses.join(", ")}`));
      }
      exam.status = status;
    }

    await exam.save();

    res.status(200).json({
      success: true,
      message: "Examination updated successfully",
      data: exam
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Delete examination by ID
 * @route DELETE /api/institute/exam/:examId
 * @access Private
 */
export const deleteExamination = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const exam = await ExaminationModel.findOneAndDelete({ examId });
    if (!exam) {
      return next(errorHandler(404, "Examination not found"));
    }

    res.status(200).json({
      success: true,
      message: "Examination deleted successfully",
      data: exam
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};