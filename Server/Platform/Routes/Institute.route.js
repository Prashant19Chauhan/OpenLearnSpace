import express from "express"
import {enroll, findInstituteDetails, getAllInstitutes, updateInstituteDetails} from "../Controllers/Institute.controller.js"
import { authMiddleware } from "../../Middlewares/Authorization.middleware.js";

const router = express()

router.post("/enroll",authMiddleware(["admin", "institute_management"], ["platform"]), enroll);
router.get("/list",authMiddleware(["admin", "institute_management", "subscription_billing", "support", "analytics"], ["platform"]), getAllInstitutes);
router.post("/updateDetails",authMiddleware(["admin", "institute_management"], ["platform"]), updateInstituteDetails);
router.post("/details",authMiddleware(["admin", "institute_management", "subscription_billing", "support", "analytics"], ["platform"]), findInstituteDetails);

export default router   