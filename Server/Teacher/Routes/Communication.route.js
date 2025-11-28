import express from "express";
import {
  getTeacherCommunications, // New import
} from "../Controllers/Communication.controller.js";

const router = express.Router();

// Get all communications for a teacher
router.get("/:teacherId", getTeacherCommunications);

export default router;