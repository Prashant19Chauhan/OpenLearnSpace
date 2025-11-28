import SalaryModel from "../../Institute/Finance/Models/Salary.model.js";
import TeacherModel from "../../Institute/Teacher/Models/Teacher.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get salary details for a specific teacher
 * @route GET /api/teacher/finance/salary/:teacherId
 * @access Private (Teacher)
 */
export const getTeacherSalaryDetails = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    
    // Validate teacherId
    if (!teacherId) {
      return next(errorHandler(400, "Teacher ID is required"));
    }
    
    // Verify the teacher exists
    const teacher = await TeacherModel.findOne({ teacherId });
    if (!teacher) {
      return next(errorHandler(404, "Teacher not found"));
    }
    
    // Find all salary records for this teacher
    const salaryRecords = await SalaryModel.find({ employeeId: teacherId })
                                          .sort({ year: -1, month: -1 }) // Latest first
                                          .limit(12); // Last 12 months
    
    if (salaryRecords.length === 0) {
      return next(errorHandler(404, "No salary records found for this teacher"));
    }
    
    // Calculate total earnings, deductions, and net salary
    const salaryStats = salaryRecords.reduce((stats, salary) => {
      stats.totalGross += salary.grossSalary || 0;
      stats.totalNet += salary.netSalary || 0;
      
      // If there are deductions and bonuses in the model
      const totalDeductions = salary.deductions 
        ? salary.deductions.reduce((sum, d) => sum + d.amount, 0) 
        : 0;
        
      const totalBonuses = salary.bonuses 
        ? salary.bonuses.reduce((sum, b) => sum + b.amount, 0) 
        : 0;
        
      stats.totalDeductions += totalDeductions;
      stats.totalBonuses += totalBonuses;
      
      return stats;
    }, {
      totalGross: 0,
      totalNet: 0,
      totalDeductions: 0,
      totalBonuses: 0
    });
    
    // Format the salary records for response
    const formattedSalaries = salaryRecords.map(salary => {
      return {
        salaryId: salary.salaryId,
        month: salary.month,
        year: salary.year,
        grossSalary: salary.grossSalary,
        netSalary: salary.netSalary,
        paymentDate: salary.paymentDate,
        status: salary.status,
        deductions: salary.deductions || [],
        bonuses: salary.bonuses || []
      };
    });
    
    res.status(200).json({
      success: true,
      message: "Teacher salary details retrieved successfully",
      data: {
        teacherId: teacherId,
        name: teacher.name,
        stats: salaryStats,
        salaries: formattedSalaries
      }
    });
    
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get a specific salary record for a teacher
 * @route GET /api/teacher/finance/salary/:teacherId/:salaryId
 * @access Private (Teacher)
 */
export const getTeacherSalaryRecord = async (req, res, next) => {
  try {
    const { teacherId, salaryId } = req.params;
    
    // Validate required parameters
    if (!teacherId || !salaryId) {
      return next(errorHandler(400, "Teacher ID and Salary ID are required"));
    }
    
    // Find the specific salary record
    const salaryRecord = await SalaryModel.findOne({ 
      salaryId: salaryId,
      employeeId: teacherId
    });
    
    if (!salaryRecord) {
      return next(errorHandler(404, "Salary record not found"));
    }
    
    res.status(200).json({
      success: true,
      message: "Salary record retrieved successfully",
      data: salaryRecord
    });
    
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get yearly salary summary for a teacher
 * @route GET /api/teacher/finance/salary/:teacherId/summary/:year
 * @access Private (Teacher)
 */
export const getTeacherYearlySalarySummary = async (req, res, next) => {
  try {
    const { teacherId, year } = req.params;
    
    // Validate required parameters
    if (!teacherId || !year) {
      return next(errorHandler(400, "Teacher ID and Year are required"));
    }
    
    // Find all salary records for this teacher for the specified year
    const salaryRecords = await SalaryModel.find({ 
      employeeId: teacherId,
      year: parseInt(year)
    }).sort({ month: 1 });
    
    if (salaryRecords.length === 0) {
      return next(errorHandler(404, `No salary records found for year ${year}`));
    }
    
    // Calculate monthly and yearly totals
    const monthlySalaries = Array(12).fill(null);
    let yearlyTotal = 0;
    
    salaryRecords.forEach(salary => {
      if (salary.month >= 1 && salary.month <= 12) {
        monthlySalaries[salary.month - 1] = {
          month: salary.month,
          grossSalary: salary.grossSalary,
          netSalary: salary.netSalary,
          status: salary.status
        };
        
        if (salary.status === 'Paid') {
          yearlyTotal += salary.netSalary;
        }
      }
    });
    
    res.status(200).json({
      success: true,
      message: `Yearly salary summary for ${year} retrieved successfully`,
      data: {
        teacherId,
        year: parseInt(year),
        monthlySalaries,
        yearlyTotal,
        recordsFound: salaryRecords.length
      }
    });
    
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};