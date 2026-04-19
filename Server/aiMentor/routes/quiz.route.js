import express from "express"
import { createQuiz, setQuizScore } from "../controllers/quiz.controller.js"

const router = express()

router.post("/createQuiz", createQuiz)
router.post("/performanceUpdate", setQuizScore);

export default router