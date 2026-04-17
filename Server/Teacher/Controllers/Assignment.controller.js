import AssignmentModel from "../../Institute/Academic/Models/Assignment.model.js";
import AssignmentReportModel from "../../Institute/Academic/Models/AssignmentReport.model.js";
import { errorHandler } from "../../Utils/Error.js";



/**
 * Create Assignment
 */
export const createAssignment =
async (req, res, next) => {

  try {

    const { title, description, dueDate, batchId } =
      req.body;

    const { userId } = req.user;

    const assignmentId =
      "ASSIGN-" + Date.now();

    const assignment =
      new AssignmentModel({

        assignmentId,
        title,
        description,
        dueDate,
        batchId,
        teacherId: userId

      });

      const assignment1 = {

        assignmentId,
        title,
        description,
        dueDate,
        batchId,
        teacherId: userId

      }
      console.log(assignment1)
    await assignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment created",
      data: assignment
    });

  } catch (error) {
    next(errorHandler(500, error.message));
  }
};



/**
 * Get Assignments by Batch
 */
export const getAssignments =
async (req, res, next) => {

  try {

    const { batchId } = req.params;

    const assignments =
      await AssignmentModel.find({
        batchId
      }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments
    });

  } catch (error) {
    next(errorHandler(500, error.message));
  }
};



/**
 * Get Assignment Report
 */
export const getAssignmentReport =
async (req, res, next) => {

  try {

    const { assignmentId } = req.params;

    const report =
      await AssignmentReportModel.findOne({
        assignmentId
      });

    res.status(200).json({
      success: true,
      students: report?.students || []
    });

  } catch (error) {
    next(errorHandler(500, error.message));
  }
};



/**
 * Update Student Report
 */
export const updateAssignmentReport =
async (req, res, next) => {

  try {

    const { assignmentId, batchId, students } =
      req.body;

    let report =
      await AssignmentReportModel.findOne({
        assignmentId
      });

    if (!report) {
      report =
        new AssignmentReportModel({

          assignmentId,
          batchId,
          students

        });

    } else {

      report.students = students;

    }

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated"
    });

  } catch (error) {
    next(errorHandler(500, error.message));
  }
};