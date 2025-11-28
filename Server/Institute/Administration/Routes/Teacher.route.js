import express from "express"
import { 
    hireTeacher, 
    resignTeacher, 
    findTeacherDetails, 
    updateTeacherDetails,
    findAllTeachersDetails 
} from "../Controllers/Teacher.controller.js"
import {authMiddleware} from "../../../Middlewares/Authorization.middleware.js"
import multer from "multer"

const router = express()
const upload = multer({ dest: "teacherImages/" })

// Teacher management routes
router.post("/hire", authMiddleware(["admin", "teacherManagement"], ["institute"]), upload.single("image"), hireTeacher)
router.delete("/resign", resignTeacher)
router.get("/:teacherId/details", authMiddleware(["admin", "teacherManagement"], ["institute"]), findTeacherDetails)
router.put("/update", updateTeacherDetails)
router.get("/all", authMiddleware(["admin", "teacherManagement"], ["institute"]), findAllTeachersDetails)

export default router