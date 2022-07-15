import express from "express";

import { getusers, updateuser } from "../controller/users.js";
import { signup, signin, refreshToken, logout } from "../controller/auth.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/token", refreshToken);
router.post("/logout", logout);
router.get("/users", getusers);
router.patch("/user/:id", updateuser);

export default router;
