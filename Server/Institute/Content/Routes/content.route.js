import express from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent
} from "../Controllers/Content.controller.js";

const router = express.Router();

// Content Routes
/**
 * @route POST /create
 * @desc Create new content
 */
router.post("/create", createContent);

/**
 * @route GET /list
 * @desc Get all content with filters
 */
router.get("/list", getAllContent);

/**
 * @route GET /:contentId
 * @desc Get content by ID
 */
router.get("/:contentId", getContentById);

/**
 * @route PUT /:contentId
 * @desc Update content by ID
 */
router.put("/:contentId", updateContent);

/**
 * @route DELETE /:contentId
 * @desc Delete content by ID
 */
router.delete("/:contentId", deleteContent);

export default router;