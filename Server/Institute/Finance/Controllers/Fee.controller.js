import Fee from '../Models/Fee.model.js';
import Batch from '../../Academic/Models/Batch.model.js';
import { errorHandler } from '../../../Utils/Error.js';
import { nanoid } from 'nanoid';

/**
 * @desc    Create a new fee record for a single student
 * @route   POST /api/institute/finance/fees/create
 * @access  Private (Admin/Accountant)
 */
export const createFee = async (req, res, next) => {
  const { instituteId, studentId, programId, batchId, amount, dueDate, description } = req.body;

  if (!instituteId || !studentId || !programId || !batchId || !amount || !dueDate) {
    return next(errorHandler(400, 'Institute, Student, Program, Batch, Amount, and Due Date are required.'));
  }

  try {
    const feeId = `FEE-${nanoid(10)}`;
    const newFee = new Fee({
      feeId,
      instituteId,
      studentId,
      programId,
      batchId,
      amount,
      dueDate,
      description,
      status: 'Unpaid',
    });

    const savedFee = await newFee.save();
    res.status(201).json({
      success: true,
      message: 'Fee record created successfully.',
      data: savedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all fee records with filtering and pagination
 * @route   GET /api/institute/finance/fees
 * @access  Private (Admin/Accountant)
 */
export const getFees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, instituteId, studentId, programId, batchId, status, search } = req.query;

    const filter = {};
    if (instituteId) filter.instituteId = instituteId;
    if (studentId) filter.studentId = studentId;
    if (programId) filter.programId = programId;
    if (batchId) filter.batchId = batchId;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { feeId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const fees = await Fee.find(filter)
      .sort({ dueDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalFees = await Fee.countDocuments(filter);
    const totalPages = Math.ceil(totalFees / limitNum);

    res.status(200).json({
      success: true,
      message: 'Fees retrieved successfully.',
      data: {
        fees,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalFees,
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
 * @desc    Get a single fee record by ID
 * @route   GET /api/institute/finance/fees/:id
 * @access  Private (Admin/Accountant/Student)
 */
export const getFeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ feeId: id });

    if (!fee) {
      return next(errorHandler(404, 'Fee record not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Fee record retrieved successfully.',
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a fee record (e.g., record a payment)
 * @route   PUT /api/institute/finance/fees/:id
 * @access  Private (Admin/Accountant)
 */
export const updateFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amountPaid, paymentMethod, transactionId, status } = req.body;

    const fee = await Fee.findOne({ feeId: id });
    if (!fee) {
      return next(errorHandler(404, 'Fee record not found.'));
    }

    // Update fields
    if (amountPaid !== undefined) fee.amountPaid = amountPaid;
    if (paymentMethod) fee.paymentMethod = paymentMethod;
    if (transactionId) fee.transactionId = transactionId;

    // Automatically update status based on payment
    if (amountPaid !== undefined) {
        if (fee.amountPaid >= fee.amount) {
            fee.status = 'Paid';
        } else if (fee.amountPaid > 0) {
            fee.status = 'Partially Paid';
        } else {
            fee.status = 'Unpaid';
        }
    }
    
    // Allow manual override of status if provided
    if (status) fee.status = status;


    const updatedFee = await fee.save();

    res.status(200).json({
      success: true,
      message: 'Fee record updated successfully.',
      data: updatedFee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a fee record
 * @route   DELETE /api/institute/finance/fees/:id
 * @access  Private (Admin)
 */
export const deleteFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFee = await Fee.findOneAndDelete({ feeId: id });

    if (!deletedFee) {
      return next(errorHandler(404, 'Fee record not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Fee record deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending fees for an institute
 * @route   GET /api/institute/finance/fees/pending
 * @access  Private (Admin/Accountant)
 */
export const getPendingFees = async (req, res, next) => {
    try {
        const { instituteId } = req.query;
        if (!instituteId) {
            return next(errorHandler(400, 'Institute ID is required.'));
        }

        const pendingFees = await Fee.find({
            instituteId,
            status: { $in: ['Unpaid', 'Partially Paid', 'Overdue'] }
        }).sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            message: 'Pending fees retrieved successfully.',
            count: pendingFees.length,
            data: pendingFees,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create fee records for all students in a batch
 * @route   POST /api/institute/finance/fees/batch
 * @access  Private (Admin/Accountant)
 */
export const createBatchFee = async (req, res, next) => {
    const { instituteId, programId, batchId, amount, dueDate, description } = req.body;

    if (!instituteId || !programId || !batchId || !amount || !dueDate) {
        return next(errorHandler(400, 'Institute, Program, Batch, Amount, and Due Date are required.'));
    }

    try {
        const batch = await Batch.findOne({ batchId, instituteId, programId });
        if (!batch) {
            return next(errorHandler(404, 'Batch not found.'));
        }

        const students = batch.studentIds;
        if (!students || students.length === 0) {
            return res.status(200).json({ success: true, message: 'No students in this batch to create fees for.', data: [] });
        }

        const feeRecords = students.map(studentId => ({
            feeId: `FEE-${nanoid(10)}`,
            instituteId,
            studentId,
            programId,
            batchId,
            amount,
            dueDate,
            description,
            status: 'Unpaid',
        }));

        const createdFees = await Fee.insertMany(feeRecords);

        res.status(201).json({
            success: true,
            message: `Successfully created ${createdFees.length} fee records for the batch.`,
            data: createdFees,
        });
    } catch (error) {
        next(error);
    }
};
