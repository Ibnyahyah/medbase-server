import express from "express";

import { signup, signin, logout, getHospitals, getHospital, revokeHospitalAccess, deleteHospital, getStaffs, getStaffById, revokeStaffAccess, deleteStaff, getPatients, getPatient, revokePatientAccess, deletePatient } from "../controller/admin.js";
import { refreshToken } from "../controller/refreshToken.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/token", refreshToken);
router.post("/logout", logout);
router.get("/hospitals", getHospitals);
router.get("/hospital/:id", getHospital);
router.put("/hospital/:id", revokeHospitalAccess);
router.delete("/hospital/:id", deleteHospital);
router.get("/staffs", getStaffs);
router.get("/staff/:id", getStaffById);
router.put("/staff/:id", revokeStaffAccess);
router.delete("/staff/:id", deleteStaff);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatient);
router.put("/patients/:id", revokePatientAccess);
router.delete("/patients/:id", deletePatient);


export default router;
