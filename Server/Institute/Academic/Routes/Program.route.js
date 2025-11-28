import express from "express"
import {
  createProgram,
  viewProgramList,
  programDetails
} from "../Controllers/Program.controller.js"
import { authMiddleware } from "../../../Middlewares/Authorization.middleware.js";

const router = express()

// Program routes
router.post("/create", authMiddleware(["admin", "academicManagement"], ["institute"]), createProgram);
router.get("/list", authMiddleware(["admin", "academicManagement"], ["institute"]), viewProgramList);
router.get("/programDetail/:programId", programDetails);

export default router