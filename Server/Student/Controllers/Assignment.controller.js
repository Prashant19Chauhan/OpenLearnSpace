import AssignmentModel from "../../Institute/Academic/Models/Assignment.model.js";
import AssignmentReportModel from "../../Institute/Academic/Models/AssignmentReport.model.js";
import Subject from "../../Institute/Academic/Models/Subject.model.js";
import { errorHandler } from "../../Utils/Error.js";


/**
 * Get Assignments by Batch
 */
export const getAssignments =
async (req, res, next) => {

  try {

    const { subjectId } = req.params;

    const subject = await Subject.findOne({subjectCode:subjectId});
    const subTeacher = subject?.teachersAssigned?.[0];

    const assignmentDetails = await AssignmentModel.find({teacherId:subTeacher});
    console.log(assignmentDetails)

    res.status(200).json({
      success: true,
      data: assignmentDetails
    });

  } catch (error) {
    next(errorHandler(500, error.message));
  }
};



/**
 * Get Assignment Report
 */
export const getAssignmentReport = async (req, res, next) => {
  try {

    const { assignmentId, studentId } = req.params;

    const report = await AssignmentReportModel.findOne({
      assignmentId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Assignment report not found"
      });
    }

    const studentDetails = report.students.find(
      (val) => val.studentId === studentId
    );

    res.status(200).json({
      success: true,
      student: studentDetails || null
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