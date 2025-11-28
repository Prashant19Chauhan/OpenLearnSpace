import express from "express"
import { login } from "../Controllers/Auth.controller.js"

const router = express()

router.post("/login", login)

export default router