import CommunicationModel from "../../Institute/Communication/Models/Communication.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get all notices associated with a student
 * @route GET /api/institute/communication/notices/:studentId
 * @access Private (Institute)
 */
export const getStudentNoticesAndComplain = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Step 1: Validate studentId
    if (!studentId) {
      return next(errorHandler(400, "Student ID is required"));
    }

    // Step 2: Find all notices for the student
    const Communication = await CommunicationModel.find({ studentId });

    if (!Communication.length) {
      return next(errorHandler(404, "No notices found for this student"));
    }

    // Step 3: Return the notices
    res.status(200).json({
      success: true,
      message: "Student notices retrieved successfully",
      data: Communication,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};