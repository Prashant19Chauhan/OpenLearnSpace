import CommunicationModel from "../../Institute/Communication/Models/Communication.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get all communications associated with a teacher
 * @route GET /api/teacher/communication/:teacherId
 * @access Private (Teacher)
 */
export const getTeacherCommunications = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    // Validate teacherId
    if (!teacherId) {
      return next(errorHandler(400, "Teacher ID is required"));
    }

    // Find all communications for the teacher
    const communications = await CommunicationModel.find({ teacherId });

    if (!communications.length) {
      return next(errorHandler(404, "No communications found for this teacher"));
    }

    // Return the communications
    res.status(200).json({
      success: true,
      message: "Teacher communications retrieved successfully",
      data: communications,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};