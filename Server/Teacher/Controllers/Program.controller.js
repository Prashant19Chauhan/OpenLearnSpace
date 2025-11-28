import ProgramModel from "../../Institute/Academic/Models/Program.model.js";
import BatchModel from "../../Institute/Academic/Models/Batch.model.js";
import StudentModel from "../../Institute/Student/Models/Student.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get all programs assigned to a teacher
 * @route GET /api/teacher/program/:teacherId
 * @access Private (Teacher)
 */
export const getTeacherPrograms = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    // Find all programs where the teacher is assigned
    const programs = await ProgramModel.find({ teachers: teacherId });

    if (!programs.length) {
      return next(errorHandler(404, "No programs found for this teacher"));
    }

    res.status(200).json({
      success: true,
      message: "Teacher programs retrieved successfully",
      data: programs.map(program => ({
        programId: program.programId,
        programName: program.programName,
        description: program.description,
        startDate: program.startDate,
        endDate: program.endDate,
        isActive: program.isActive
      }))
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get all batches under a specific program for a teacher
 * @route GET /api/teacher/program/:programId/batches/:teacherId
 * @access Private (Teacher)
 */
export const getTeacherBatches = async (req, res, next) => {
  try {
    const { programId, teacherId } = req.params;

    // Validate program and teacher IDs
    if (!programId || !teacherId) {
      return next(errorHandler(400, "Program ID and Teacher ID are required"));
    }

    // Find batches in the program where the teacher is assigned
    const batches = await BatchModel.find({
      programId,
      teachersAssigned: teacherId
    });

    if (!batches.length) {
      return next(errorHandler(404, "No batches found for this teacher in the program"));
    }

    res.status(200).json({
      success: true,
      message: "Teacher batches retrieved successfully",
      data: batches.map(batch => ({
        batchId: batch.batchId,
        batchName: batch.batchName,
        startDate: batch.startDate,
        endDate: batch.endDate,
        currentEnrollment: batch.currentEnrollment,
        maxStudents: batch.maxStudents,
        isActive: batch.isActive
      }))
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get all students enrolled in a specific batch
 * @route GET /api/teacher/batch/:batchId/students
 * @access Private (Teacher)
 */
export const getBatchStudents = async (req, res, next) => {
  try {
    const { batchId } = req.params;

    // Find the batch by ID
    const batch = await BatchModel.findOne({ batchId });

    if (!batch) {
      return next(errorHandler(404, "Batch not found"));
    }

    // Get student details for all students in the batch
    const students = await StudentModel.find({
      studentId: { $in: batch.studentIds }
    });

    if (!students.length) {
      return next(errorHandler(404, "No students found in this batch"));
    }

    res.status(200).json({
      success: true,
      message: "Batch students retrieved successfully",
      data: {
        batchId: batch.batchId,
        batchName: batch.batchName,
        students: students.map(student => ({
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          enrollmentDate: student.enrollmentDate,
          isActive: student.isActive
        }))
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};