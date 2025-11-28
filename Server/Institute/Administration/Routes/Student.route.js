import express from "express"
import { 
    enrollStudent, 
    removeStudent, 
    findStudentDetails, 
    updateStudentDetails, 
    findAllStudentsDetails,
} from "../Controllers/Student.controller.js"
import {authMiddleware} from "../../../Middlewares/Authorization.middleware.js"
import multer from "multer"
const upload = multer({ dest: "studentsImages/" })

const router = express.Router()

// Student management routes
router.post("/enroll", authMiddleware(["admin", "studentManagement"], ["institute"]), upload.single("image"), enrollStudent)
router.delete("/remove", removeStudent)
router.get("/:studentId/details", authMiddleware(["admin", "studentManagement"], ["institute"]), findStudentDetails)
router.put("/update", updateStudentDetails)
router.get("/all", authMiddleware(["admin", "studentManagement"], ["institute"]), findAllStudentsDetails)

export default router
