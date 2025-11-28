import express from "express";
import {
  getStudentFinanceDetails // New import
} from "../Controllers/Finance.controller.js";

const router = express.Router();

// Get all finance details for a student
router.get("/:studentId", getStudentFinanceDetails);

export default router;