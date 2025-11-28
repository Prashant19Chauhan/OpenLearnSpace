import express from "express";
import { 
  getTeacherSalaryDetails,
  getTeacherSalaryRecord,
  getTeacherYearlySalarySummary
} from "../Controllers/Finance.controller.js";

const router = express.Router();

// Get all salary details for a teacher
router.get("/salary/:teacherId", getTeacherSalaryDetails);

// Get a specific salary record
router.get("/salary/:teacherId/:salaryId", getTeacherSalaryRecord);

// Get yearly salary summary
router.get("/salary/:teacherId/summary/:year", getTeacherYearlySalarySummary);

export default router;