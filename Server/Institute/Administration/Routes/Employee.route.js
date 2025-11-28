import express from "express"
import { 
    hireEmployee, 
    fireEmployee, 
    findEmployeeDetails, 
    updateEmployeeDetails, 
    findAllEmployeesDetails
} from "../Controllers/Employee.controller.js"
import  {authMiddleware} from "../../../Middlewares/Authorization.middleware.js"
import multer from "multer"

const upload = multer({ dest: "employeeImages/" })

const router = express.Router()

// Employee management routes
router.post("/hire", authMiddleware(["admin", "employeeManagement"], ["institute"]), upload.single("image"), hireEmployee)
router.delete("/fire", fireEmployee)
router.get("/:employeeId/details", authMiddleware(["admin", "employeeManagement"], ["institute"]), findEmployeeDetails)
router.put("/update", updateEmployeeDetails)
router.get("/all",authMiddleware(["admin", "employeeManagement"], ["institute"]), findAllEmployeesDetails)

export default router
