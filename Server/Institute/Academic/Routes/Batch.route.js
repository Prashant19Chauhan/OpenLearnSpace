import express from "express"
import {
  createBatch,
  viewBatchList,
  batchDetails,
  updateBatch,
  deleteBatch,
  getBatchesByProgram,
  toggleBatchStatus,
  addStudentToBatch,
  removeStudentFromBatch
} from "../Controllers/Batch.controller.js"
import { authMiddleware } from "../../../Middlewares/Authorization.middleware.js"

const router = express.Router({ mergeParams: true })

// ==================== BATCH ROUTES ====================

// Create new batch
// POST /api/batches/create
router.post("/create", authMiddleware(["admin", "academicManagement"], ["institute"]), createBatch)

// Get all batches with filtering and pagination
// GET /api/batches/list?page=1&limit=10&search=CS&programId=PROG001&isActive=true
router.get("/list", authMiddleware(["admin", "academicManagement"], ["institute"]), viewBatchList)

// Get specific batch details by batchId
// GET /api/batches/batchDetail/:batchId
router.get("/:batchId", authMiddleware(["admin", "academicManagement"], ["institute"]), batchDetails)

// Update batch details
// PUT /api/batches/:batchId
router.put("/update/:batchId", updateBatch)

// Delete batch (soft delete)
// DELETE /api/batches/:batchId
router.delete("/delete/:batchId", deleteBatch)

// Get batches by specific program
// GET /api/batches/program/:programId?isActive=true
router.get("/program/:programId", getBatchesByProgram)

// Toggle batch status (activate/deactivate)
// PATCH /api/batches/:batchId/toggle-status
router.patch("/:batchId/toggle-status", toggleBatchStatus)

// Student management routes
// Add student to batch
// POST /api/batches/:batchId/add-student
router.post("/:batchId/add-student", addStudentToBatch)

// Remove student from batch
// POST /api/batches/:batchId/remove-student
router.post("/:batchId/remove-student", removeStudentFromBatch)

export default router
