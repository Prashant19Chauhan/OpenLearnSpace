import StudentModel from "../../Institute/Student/Models/Student.model.js";
import FeeModel from "../../Institute/Finance/Models/Fee.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get all financial details for a student
 * @route GET /api/student/finance/:studentId
 * @access Private (Student)
 */
export const getStudentFinanceDetails = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Step 1: Validate student exists
    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return next(errorHandler(404, "Student not found"));
    }

    // Step 2: Find all fee records for this student
    const fees = await FeeModel.find({ studentId })

    // Step 3: Return the financial details
    res.status(200).json({
      success: true,
      message: "Student finance details retrieved successfully",
      data: {
        studentId,
        fees: fees.map(fee => ({
          feeId: fee.feeId,
          feeType: fee.feeType ? fee.feeType.name : "Unknown",
          amount: fee.amount,
          dueDate: fee.dueDate,
          status: fee.status,
          paymentDate: fee.paymentDate,
          paymentMethod: fee.paymentMethod ? fee.paymentMethod.name : null,
          transactionId: fee.transactionId,
          remarks: fee.remarks
        }))
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

