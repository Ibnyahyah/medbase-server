import express from "express";

import { signup, signin, logout, getHospitals, getHospital, revokeHospitalAccess, deleteHospital, getStaff, getStaffById, revokeStaffAccess, deleteStaff, getPatients, getPatient, revokePatientAccess, deletePatient } from "../controller/admin.js";
import { refreshToken } from "../controller/auth.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/token", refreshToken);
router.post("/logout", logout);
router.get("/hospitals", getHospitals);
router.get("/hospitals/:id", getHospital);
router.put("/hospitals/:id", revokeHospitalAccess);
router.delete("/hospitals/:id", deleteHospital);
router.get("/staff", getStaff);
router.get("/staff/:id", getStaffById);
router.put("/staff/:id", revokeStaffAccess);
router.delete("/staff/:id", deleteStaff);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatient);
router.put("/patients/:id", revokePatientAccess);
router.delete("/patients/:id", deletePatient);


export default router;
