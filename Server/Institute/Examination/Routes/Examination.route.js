import express from "express";
import {
  createExamination,
  getAllExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination
} from "../Controllers/Examination.controller.js";

const router = express.Router();

// Examination Routes
/**
 * @route POST /create
 * @desc Create new examination
 */
router.post("/create", createExamination);

/**
 * @route GET /list
 * @desc Get all examinations with filters
 */
router.get("/list", getAllExaminations);

/**
 * @route GET /:examId
 * @desc Get examination by ID
 */
router.get("/:examId", getExaminationById);

/**
 * @route PUT /:examId
 * @desc Update examination by ID
 */
router.put("/:examId", updateExamination);

/**
 * @route DELETE /:examId
 * @desc Delete examination by ID
 */
router.delete("/:examId", deleteExamination);

export default router;