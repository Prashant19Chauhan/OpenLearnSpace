import express from "express";
import {
  getAllData,
} from "../Controllers/Content.controller.js";

const router = express.Router();

// Get All Data
router.get("/", getAllData);

export default router;