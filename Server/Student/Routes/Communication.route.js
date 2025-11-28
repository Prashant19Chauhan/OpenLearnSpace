import express from "express";
import {
  getStudentNoticesAndComplain, // New import
} from "../Controllers/Communication.controller.js";

const router = express.Router();

// Get all notices for a student
router.get("/communication/:studentId", getStudentNoticesAndComplain);

export default router;