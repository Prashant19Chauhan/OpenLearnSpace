import express from "express";
import {
  getStudentProgram,
  getStudentProgramBatches,
  getBatchSubjects,
  getSubjectComprehensiveDetails // New import
} from "../Controllers/Program.controller.js";
import {authMiddleware} from "../../Middlewares/Authorization.middleware.js"
import { getAssignmentReport, getAssignments } from "../Controllers/Assignment.controller.js";

const router = express.Router();

// Get program for a student
router.get("/program/:studentId", getStudentProgram);

// Get student's batches for a specific program
router.get("/program/:programId/batches/:studentId", getStudentProgramBatches);

// Get all subjects for a specific batch
router.get("/batch/subjects", authMiddleware(["student"], ["student"]), getBatchSubjects);

// Get comprehensive details for a specific subject
router.get("/subject/:subjectId/details", getSubjectComprehensiveDetails);

router.get(
  "/:subjectId/assignments",authMiddleware(["student"], ["student"]),
  getAssignments
);

router.get(
  "/assignment/:assignmentId/report/student/:studentId",authMiddleware(["student"], ["student"]),
  getAssignmentReport
);

export default router;