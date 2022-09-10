import express from "express";

import { signup, signin, refreshToken, logout, getPatients,getPatient } from "../controller/staffs.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/token", refreshToken);
router.post("/logout", logout);
router.get("/patients", getPatients);
router.get("/patient/:id", getPatient);

export default router;
