import express from "express"
import { login, logout, refresh } from "../Controllers/Auth.controller.js";

const router = express();

router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh", refresh)

export default router;