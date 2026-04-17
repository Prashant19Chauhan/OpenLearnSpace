import express from "express";
import {
  getTeacherPrograms,
  getTeacherBatches,
  getBatchStudents,
  getTeacherSubjects
} from "../Controllers/Program.controller.js";
import { authMiddleware } from "../../Middlewares/Authorization.middleware.js";
import { createAssignment, getAssignmentReport, getAssignments, updateAssignmentReport } from "../Controllers/Assignment.controller.js";

const router = express.Router();

// Get all programs for a teacher
router.get("/:teacherId", getTeacherPrograms);

// Get all batches for a program and teacher
router.get("/:programId/batches/:teacherId", getTeacherBatches);

// Get all students in a batch
router.get("/:batchId/students", getBatchStudents);


router.get("/subjects/teachers",authMiddleware(["teacher"], ["teacher"]), getTeacherSubjects);

router.post("/assignment",authMiddleware(["teacher"], ["teacher"]), createAssignment);

router.get(
  "/:batchId/assignments",authMiddleware(["teacher"], ["teacher"]),
  getAssignments
);

router.put(
  "/assignment/report",authMiddleware(["teacher"], ["teacher"]),
  updateAssignmentReport
);

router.get(
  "/assignment/:assignmentId/report",authMiddleware(["teacher"], ["teacher"]),
  getAssignmentReport
);

export default router;