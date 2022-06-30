import express from "express";

import {
  signup,
  signin,
  getDoctors,
  updateDoctor,
} from "../controller/doctors.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.get("/doctors", getDoctors);
router.patch("/doctors/:id", updateDoctor);

export default router;
