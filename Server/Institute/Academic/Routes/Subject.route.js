import express from "express";
import {
  addSubjectToBatch,
  updateSubjectDetail,
  viewSubjectDetail,
  viewSubjectList,
  addTeacherToSubject,
  removeTeacherFromSubject,
} from "../Controllers/Subject.controller.js";
import { authMiddleware } from "../../../Middlewares/Authorization.middleware.js";

const router = express.Router({ mergeParams: true });

// Add a new subject to a specific batch
router.post("/createSubject", authMiddleware(["admin", "academicManagement"], ["institute"]), addSubjectToBatch);

// Update subject details
router.put("/subject/:subjectId", updateSubjectDetail);

// View subject details
router.get("/subject/:subjectId", viewSubjectDetail);

// View subject list with filters
router.get("/list", authMiddleware(["admin", "academicManagement"], ["institute"]), viewSubjectList);

// Add teacher to subject
router.post("/subject/:subjectId/add-teacher", addTeacherToSubject);

// Remove teacher from subject
router.post("/subject/:subjectId/remove-teacher", removeTeacherFromSubject);

export default router;