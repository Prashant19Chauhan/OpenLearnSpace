import BatchModel from "../Models/Batch.model.js"
import InstituteModel from "../../Administration/Models/Institute.model.js"
import ProgramModel from "../Models/Program.model.js"
import { errorHandler } from "../../../Utils/Error.js"
import { nanoid } from "nanoid"

// Create new batch
export const createBatch = async(req, res, next) => {
  try {
    const { programId } = req.params;
    const {instituteId} = req.user;
    const {
      name,
      startDate,
      endDate,
      maxCapacity,
      instructor,
      description,
    } = req.body

    // Validate required fields
    if (!name || !instituteId || !programId || !startDate || !endDate) {
      return next(errorHandler(400, "Batch name, institute ID, program ID, start date, and end date are required"))
    }

    const institute = await InstituteModel.findOne({instituteId});

    const program = await ProgramModel.findOne({programId})
    if(!program) return next(errorHandler(404, "program not found"))

    // Check if batch with same name already exists in the program
    const existingBatch = await BatchModel.findOne({
      name,
      programId
    })

    if (existingBatch) {
      return next(errorHandler(409, "Batch with this name already exists in the program"))
    }

    // Generate unique batch ID
    const batchId = "INST-PROG-BATCH-" + nanoid(8).toUpperCase()

    // Create new batch
    const batch = await BatchModel.create({
      batchId,
      name,
      instituteId,
      programId,
      description,
      startDate,
      endDate,
      maxStudents: maxCapacity || 30,
    })

    program.batchIds.push(batchId);
    await program.save();

    if (!batch) {
      return next(errorHandler(500, "Error while creating batch"))
    }

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// View all batches with filtering and pagination
export const viewBatchList = async(req, res, next) => {
  try {
    const {instituteId} = req.user;
    const {programId} = req.params;

    const institute = await InstituteModel.findOne({instituteId});
    if(!institute.programs.includes(programId)) return next(errorHandler(404, "program not found"))

    const batchs = await BatchModel.find({programId, instituteId})
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: "Batches retrieved successfully",
      data: batchs
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// View specific batch details
export const batchDetails = async(req, res, next) => {
  try {
    const { batchId } = req.params
    // Validate batch ID
    if (!batchId) {
      return next(errorHandler(400, "Batch ID is required"))
    }

    // Find batch by custom batchId field with populated data
    const batch = await BatchModel.findOne({ batchId })

    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    return res.status(200).json({
      success: true,
      message: "Batch details retrieved successfully",
      data: batch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Update batch details
export const updateBatch = async(req, res, next) => {
  try {
    const { batchId } = req.params
    const updateData = req.body

    // Remove fields that shouldn't be updated directly
    delete updateData.batchId
    delete updateData.instituteId
    delete updateData.currentEnrollment

    // Validate batch exists
    const batch = await BatchModel.findOne({ batchId })
    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    // If updating batch name, check for duplicates
    if (updateData.batchName && updateData.batchName !== batch.batchName) {
      const existingBatch = await BatchModel.findOne({
        batchName: updateData.batchName,
        programId: batch.programId,
        batchId: { $ne: batchId }
      })

      if (existingBatch) {
        return next(errorHandler(409, "Batch with this name already exists in the program"))
      }
    }

    // Update batch
    const updatedBatch = await BatchModel.findOneAndUpdate(
      { batchId },
      {
        $set: updateData
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!updatedBatch) {
      return next(errorHandler(500, "Error while updating batch"))
    }

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: updatedBatch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Delete batch (soft delete)
export const deleteBatch = async(req, res, next) => {
  try {
    const { batchId } = req.params

    const batch = await BatchModel.findOne({ batchId })
    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    // Check if batch has enrolled students
    if (batch.currentEnrollment > 0) {
      return next(errorHandler(400, "Cannot delete batch with enrolled students"))
    }

    // Soft delete by setting isActive to false
    batch.isActive = false
    await batch.save()

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
      data: {}
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Get batches by program
export const getBatchesByProgram = async(req, res, next) => {
  try {
    const { programId } = req.params
    const { isActive } = req.query

    const filter = { programId }
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const batches = await BatchModel.find(filter)
      .populate("subjects.subjectId", "subjectName")
      .populate("studentIds", "firstName lastName")
      .sort({ startDate: 1 })

    return res.status(200).json({
      success: true,
      message: "Program batches retrieved successfully",
      data: batches
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Toggle batch status
export const toggleBatchStatus = async(req, res, next) => {
  try {
    const { batchId } = req.params

    const batch = await BatchModel.findOne({ batchId })
    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    batch.isActive = !batch.isActive
    await batch.save()

    return res.status(200).json({
      success: true,
      message: `Batch ${batch.isActive ? 'activated' : 'deactivated'} successfully`,
      data: batch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Add student to batch
export const addStudentToBatch = async(req, res, next) => {
  try {
    const { batchId } = req.params
    const { studentId } = req.body

    if (!studentId) {
      return next(errorHandler(400, "Student ID is required"))
    }

    const batch = await BatchModel.findOne({ batchId })
    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    // Check if batch is full
    if (batch.currentEnrollment >= batch.maxStudents) {
      return next(errorHandler(400, "Batch is full. Cannot add more students"))
    }

    // Check if student is already in the batch
    if (batch.studentIds.includes(studentId)) {
      return next(errorHandler(400, "Student is already enrolled in this batch"))
    }

    // Add student to batch
    batch.studentIds.push(studentId)
    batch.currentEnrollment += 1
    await batch.save()

    return res.status(200).json({
      success: true,
      message: "Student added to batch successfully",
      data: batch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

// Remove student from batch
export const removeStudentFromBatch = async(req, res, next) => {
  try {
    const { batchId } = req.params
    const { studentId } = req.body

    if (!studentId) {
      return next(errorHandler(400, "Student ID is required"))
    }

    const batch = await BatchModel.findOne({ batchId })
    if (!batch) {
      return next(errorHandler(404, "Batch not found"))
    }

    // Check if student is in the batch
    if (!batch.studentIds.includes(studentId)) {
      return next(errorHandler(400, "Student is not enrolled in this batch"))
    }

    // Remove student from batch
    batch.studentIds = batch.studentIds.filter(id => id !== studentId)
    batch.currentEnrollment = Math.max(0, batch.currentEnrollment - 1)
    await batch.save()

    return res.status(200).json({
      success: true,
      message: "Student removed from batch successfully",
      data: batch
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}
