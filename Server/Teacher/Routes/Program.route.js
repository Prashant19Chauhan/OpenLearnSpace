import express from "express";
import {
  getTeacherPrograms,
  getTeacherBatches,
  getBatchStudents
} from "../Controllers/Program.controller.js";

const router = express.Router();

// Get all programs for a teacher
router.get("/:teacherId", getTeacherPrograms);

// Get all batches for a program and teacher
router.get("/:programId/batches/:teacherId", getTeacherBatches);

// Get all students in a batch
router.get("/:batchId/students", getBatchStudents);

export default router;