import express from "express";

import { signup, signin, logout } from "../controller/admin.js";
import { refreshToken } from "../controller/auth.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/token", refreshToken);
router.post("/logout", logout);

export default router;
