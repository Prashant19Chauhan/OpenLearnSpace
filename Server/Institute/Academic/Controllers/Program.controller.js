import ProgramModel from "../Models/Program.model.js"
import InstituteModel from "../../Administration/Models/Institute.model.js"
import { errorHandler } from "../../../Utils/Error.js"
import { nanoid } from "nanoid"

export const createProgram = async(req, res, next) => {
  try {
    const {instituteId} = req.user
    const {
      programName,
      description,
      department,
      programType,
      duration,
      enrolled,
      capacity,
      startDate,
      fee,
      level
    } = req.body

    // Validate required fields
    if (!programName || !instituteId) {
      return next(errorHandler(400, "Program name and institute ID are required"))
    }

    // Check if program with same name already exists in the institute
    const existingInstitute = await InstituteModel.findOne({instituteId});
    if(!existingInstitute) return next(errorHandler(404, "institute not found"));

    const existingProgram = await ProgramModel.findOne({
      programName,
      instituteId
    })

    if (existingProgram) {
      return next(errorHandler(409, "Program with this name already exists in the institute"))
    }

    const programId = "INST-PROG-"+nanoid(12).toUpperCase()
    // Create new program
    const program = await ProgramModel.create({
      programId: programId,
      programName,
      instituteId,
      batchIds: [],
      studentIds: [],
      subjects: [],
      description,
      department,
      programType,
      duration,
      enrolled,
      capacity,
      startDate,
      fee,
      level
    })

    existingInstitute.programs.push(programId);
    await existingInstitute.save();

    if (!program) {
      return next(errorHandler(500, "Error while creating program"))
    }

    return res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: program
    })

  } catch (error) {
    next(errorHandler(500, error.message || "internal Server Error"))
  }
}

export const viewProgramList = async(req, res, next) => {
  try {
    const {instituteId} = req.user;
    if(!instituteId) return next(errorHandler(404, "institute not found"))
    
    const programs = await ProgramModel.find({instituteId})
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: "Programs retrieved successfully",
      data: programs
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}

export const programDetails = async(req, res, next) => {
  try {
    const { programId } = req.params

    // Validate program ID
    if (!programId) {
      return next(errorHandler(400, "Program ID is required"))
    }

    // Find program by custom programId field with populated data
    const program = await ProgramModel.findOne({ programId })

    if (!program) {
      return next(errorHandler(404, "Program not found"))
    }

    return res.status(200).json({
      success: true,
      message: "Program details retrieved successfully",
      data: program
    })

  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"))
  }
}