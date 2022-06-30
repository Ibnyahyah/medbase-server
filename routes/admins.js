import express from "express";

import { signup, signin } from "../controller/admin.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);

export default router;
