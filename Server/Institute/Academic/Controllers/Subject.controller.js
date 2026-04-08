import SubjectModel from "../Models/Subject.model.js";
import BatchModel from "../Models/Batch.model.js";
import { errorHandler } from "../../../Utils/Error.js";
import { nanoid } from "nanoid";
import InstituteModel from "../../Administration/Models/Institute.model.js";
import ProgramModel from "../Models/Program.model.js";

/**
 * Add a new subject to a specific batch
 * @route POST /api/institute/program/batch/:batchId/subject
 * @access Private
 */
export const addSubjectToBatch = async (req, res, next) => {
  try {
    const { programId, batchId } = req.params;
    const {instituteId} = req.user;
    const {
      subjectName,
      subjectCode,
      subjectDescription,
      teacherId,
    } = req.body;


    // Validate required fields
    if (!subjectName || !subjectCode || !instituteId || !programId) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Find the batch
    const batch = await BatchModel.findOne({ batchId });
    if (!batch) {
      return next(errorHandler(404, "Batch not found"));
    }

    // Ensure the batch belongs to the same institute and program
    if (batch.instituteId !== instituteId || batch.programId !== programId) {
      return next(
        errorHandler(
          400,
          "Subject's institute/program does not match batch's institute/program"
        )
      );
    }

    const institute = await InstituteModel.findOne({instituteId});
    const program = await ProgramModel.findOne({programId});

    // Check if subject with same code already exists in the same program
    const existingSubject = await SubjectModel.findOne({
      subjectCode,
      instituteId,
      programId,
      batchId,
    });
    if (existingSubject) {
      return next(
        errorHandler(409, "Subject with this code already exists in the program")
      );
    }

    // Generate subjectId following the regex pattern
    const subjectId = "SUB" + nanoid(6, "0123456789");

    // Create new subject
    const newSubject = new SubjectModel({
      subjectId,
      subjectName,
      instituteId,
      programId,
      batchId,
      subjectDescription,
      subjectCode,
      teachersAssigned:teacherId,
    });

    await newSubject.save();

    // Add subject to batch's subjects array
    batch.subjects.push({
      subjectId: newSubject.subjectId,
      teacherId: newSubject.teacherId,
      isActive: true,
    });
    await batch.save();

    // Send response

    res.status(201).json({
      success: true,
      message: "Subject added to batch successfully",
      data: newSubject,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Update a subject's details
 * @route PUT /api/institute/program/subject/:subjectId
 * @access Private
 */
export const updateSubjectDetail = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const {
      subjectName,
      subjectCode,
      subjectDescription,
      instituteId,
      programId,
      batchId,
    } = req.body;

    // Find the subject
    const subject = await SubjectModel.findOne({ subjectId });
    if (!subject) {
      return next(errorHandler(404, "Subject not found"));
    }

    // Prevent updating core identifiers
    const updateData = {};
    if (subjectName && subjectName !== subject.subjectName) {
      updateData.subjectName = subjectName;
    }
    if (subjectDescription && subjectDescription !== subject.subjectDescription) {
      updateData.subjectDescription = subjectDescription;
    }

    // Check for duplicate subject code if changed
    if (subjectCode && subjectCode !== subject.subjectCode) {
      const existingSubject = await SubjectModel.findOne({
        subjectCode,
        instituteId,
        programId,
        subjectId: { $ne: subjectId },
      });
      if (existingSubject) {
        return next(
          errorHandler(409, "Subject with this code already exists in the program")
        );
      }
      updateData.subjectCode = subjectCode;
    }

    // Update subject
    const updatedSubject = await SubjectModel.findOneAndUpdate(
      { subjectId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: updatedSubject,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get details of a specific subject
 * @route GET /api/institute/program/subject/:subjectId
 * @access Private
 */
export const viewSubjectDetail = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const subject = await SubjectModel.findOne({ subjectId });
    if (!subject) {
      return next(errorHandler(404, "Subject not found"));
    }

    res.status(200).json({
      success: true,
      message: "Subject details retrieved successfully",
      data: subject,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * List all subjects with filters and pagination
 * @route GET /api/institute/program/subject/list
 * @access Private
 */
export const viewSubjectList = async (req, res, next) => {
  try {
    const { instituteId } = req.user;
    const {
      programId,
      batchId
    } = req.params;

    const subjects = await SubjectModel.find({
      instituteId,
      programId,
      batchId
    })
    
    res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Add a teacher to a subject
 * @route POST /api/institute/program/subject/:subjectId/add-teacher
 * @access Private
 */
export const addTeacherToSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return next(errorHandler(400, "Teacher ID is required"));
    }

    const subject = await SubjectModel.findOne({ subjectId });
    if (!subject) {
      return next(errorHandler(404, "Subject not found"));
    }

    // Check if teacher is already assigned
    if (subject.teachersAssigned.includes(teacherId)) {
      return next(errorHandler(400, "Teacher is already assigned to this subject"));
    }

    // Add teacher to subject
    subject.teachersAssigned.push(teacherId);
    await subject.save();

    res.status(200).json({
      success: true,
      message: "Teacher added to subject successfully",
      data: subject,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Remove a teacher from a subject
 * @route POST /api/institute/program/subject/:subjectId/remove-teacher
 * @access Private
 */
export const removeTeacherFromSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return next(errorHandler(400, "Teacher ID is required"));
    }

    const subject = await SubjectModel.findOne({ subjectId });
    if (!subject) {
      return next(errorHandler(404, "Subject not found"));
    }

    // Check if teacher is assigned
    if (!subject.teachersAssigned.includes(teacherId)) {
      return next(errorHandler(400, "Teacher is not assigned to this subject"));
    }

    // Remove teacher from subject
    subject.teachersAssigned = subject.teachersAssigned.filter(
      (id) => id !== teacherId
    );
    await subject.save();

    res.status(200).json({
      success: true,
      message: "Teacher removed from subject successfully",
      data: subject,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};