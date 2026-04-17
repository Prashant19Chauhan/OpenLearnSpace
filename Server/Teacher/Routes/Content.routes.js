import express from "express";
import {
  CreateSyllabus,
  createChapters,
  createTopics,
  createSubTopics,
  createNotesVideo,
  getAllData,
} from "../Controllers/Content.controller.js";

const router = express.Router();

// Syllabus
router.post("/syllabus", CreateSyllabus);

// Chapter
router.post("/chapter", createChapters);

// Topic
router.post("/topic", createTopics);

// SubTopic
router.post("/subtopic", createSubTopics);

// Notes & Videos (Resources)
router.post("/resource", createNotesVideo);

// Get All Data
router.get("/", getAllData);

export default router;