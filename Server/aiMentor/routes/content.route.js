import express from "express"
import { createContent } from "../controllers/content.controller.js"

const router = express()

router.post("/createContent", createContent)

export default router