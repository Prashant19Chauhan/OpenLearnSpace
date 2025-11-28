import Salary from '../Models/Salary.model.js';
import Employee from '../../Administration/Models/Employee.model.js';
import { errorHandler } from '../../../Utils/Error.js';
import { nanoid } from 'nanoid';

/**
 * @desc    Create a new salary record (e.g., for a payroll run)
 * @route   POST /api/institute/finance/salaries/create
 * @access  Private (Admin/Accountant)
 */
export const createSalary = async (req, res, next) => {
  const { instituteId, employeeId, grossSalary, deductions, bonuses, month, year } = req.body;

  if (!instituteId || !employeeId || !grossSalary || !month || !year) {
    return next(errorHandler(400, 'Institute ID, Employee ID, Gross Salary, Month, and Year are required.'));
  }

  try {
    // Check if the employee exists
    const employee = await Employee.findOne({ employeeId, instituteId });
    if (!employee) {
      return next(errorHandler(404, 'Employee not found in this institute.'));
    }
    
    // Check if a salary for this employee for this month/year already exists
    const existingSalary = await Salary.findOne({ employeeId, month, year });
    if (existingSalary) {
        return next(errorHandler(409, `Salary for employee ${employeeId} for ${month}/${year} already exists.`));
    }

    // Calculate net salary
    const totalDeductions = deductions ? deductions.reduce((acc, d) => acc + d.amount, 0) : 0;
    const totalBonuses = bonuses ? bonuses.reduce((acc, b) => acc + b.amount, 0) : 0;
    const netSalary = grossSalary - totalDeductions + totalBonuses;

    const salaryId = `SAL-${nanoid(10)}`;
    const newSalary = new Salary({
      salaryId,
      instituteId,
      employeeId,
      grossSalary,
      deductions,
      bonuses,
      netSalary,
      month,
      year,
      status: 'Pending', // Default status
    });

    const savedSalary = await newSalary.save();
    res.status(201).json({
      success: true,
      message: 'Salary record created successfully.',
      data: savedSalary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all salary records with filtering and pagination
 * @route   GET /api/institute/finance/salaries
 * @access  Private (Admin/Accountant)
 */
export const getSalaries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, instituteId, employeeId, month, year, status } = req.query;

    const filter = {};
    if (instituteId) filter.instituteId = instituteId;
    if (employeeId) filter.employeeId = employeeId;
    if (month) filter.month = month;
    if (year) filter.year = year;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const salaries = await Salary.find(filter)
      .sort({ year: -1, month: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalSalaries = await Salary.countDocuments(filter);
    const totalPages = Math.ceil(totalSalaries / limitNum);

    res.status(200).json({
      success: true,
      message: 'Salaries retrieved successfully.',
      data: {
        salaries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalSalaries,
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
 * @desc    Get a single salary record by ID
 * @route   GET /api/institute/finance/salaries/:id
 * @access  Private (Admin/Accountant/Employee)
 */
export const getSalaryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findOne({ salaryId: id });

    if (!salary) {
      return next(errorHandler(404, 'Salary record not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Salary record retrieved successfully.',
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a salary record
 * @route   PUT /api/institute/finance/salaries/:id
 * @access  Private (Admin/Accountant)
 */
export const updateSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the original salary record
    const salary = await Salary.findOne({ salaryId: id });
    if (!salary) {
        return next(errorHandler(404, 'Salary record not found.'));
    }

    // Recalculate netSalary if grossSalary, deductions, or bonuses are updated
    if (updates.grossSalary || updates.deductions || updates.bonuses) {
        const grossSalary = updates.grossSalary || salary.grossSalary;
        const deductions = updates.deductions || salary.deductions;
        const bonuses = updates.bonuses || salary.bonuses;

        const totalDeductions = deductions.reduce((acc, d) => acc + d.amount, 0);
        const totalBonuses = bonuses.reduce((acc, b) => acc + b.amount, 0);
        updates.netSalary = grossSalary - totalDeductions + totalBonuses;
    }

    const updatedSalary = await Salary.findOneAndUpdate(
      { salaryId: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Salary record updated successfully.',
      data: updatedSalary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a salary record
 * @route   DELETE /api/institute/finance/salaries/:id
 * @access  Private (Admin)
 */
export const deleteSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSalary = await Salary.findOneAndDelete({ salaryId: id });

    if (!deletedSalary) {
      return next(errorHandler(404, 'Salary record not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Salary record deleted successfully.',
      data: {},
    });
} catch (error) {
  next(error);
}
};