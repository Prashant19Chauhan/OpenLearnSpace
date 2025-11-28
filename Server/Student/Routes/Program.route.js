import express from "express";
import {
  getStudentProgram,
  getStudentProgramBatches,
  getBatchSubjects,
  getSubjectComprehensiveDetails // New import
} from "../Controllers/Program.controller.js";

const router = express.Router();

// Get program for a student
router.get("/program/:studentId", getStudentProgram);

// Get student's batches for a specific program
router.get("/program/:programId/batches/:studentId", getStudentProgramBatches);

// Get all subjects for a specific batch
router.get("/batch/:batchId/subjects", getBatchSubjects);

// Get comprehensive details for a specific subject
router.get("/subject/:subjectId/details", getSubjectComprehensiveDetails);

export default router;