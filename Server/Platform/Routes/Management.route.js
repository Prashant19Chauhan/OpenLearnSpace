import express from "express"
import {getAllUsers, findUser, deleteUser, updateUser, updatePassword} from "../Controllers/Management.controller.js"
import { authMiddleware } from "../../Middlewares/Authorization.middleware.js";

const router = express();

router.get("/users",authMiddleware(["admin"]), getAllUsers);
router.post("/userDetail", authMiddleware(["admin"]), findUser);
router.post("/deleteUser",authMiddleware(["admin"]), deleteUser);
router.post("/updateUser",authMiddleware(["admin"]), updateUser);
router.post("/updatePassword",authMiddleware(["admin", "institute_management", "subscription_billing", "support", "analytics"]), updatePassword);

export default router;