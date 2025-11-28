import express from "express"
import {login} from  "../Controllers/Auth.controller.js"

const router = express()

router.use("/login", login)

export default router;