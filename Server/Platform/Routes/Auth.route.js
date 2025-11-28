import express from "express"
import {login, refresh, register, logout} from "../Controllers/Auth.controller.js"
import { authMiddleware } from "../../Middlewares/Authorization.middleware.js"

const router = express()

router.post("/login", login)
router.post("/register", authMiddleware(["admin"], ["platform"]), register)
router.post("/logout", logout)
router.post("/refresh", refresh) 

export default router;