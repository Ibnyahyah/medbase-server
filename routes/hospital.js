import express from 'express';
const router = express.Router()
// import {login, register, logout, getAllUsers, getUser, deleteUser } from "../controller/hospital.js";
// import { createPatient, getPatient, getPatients, updatePatient, deletePatient } from "../controller/patient.js";
import { login, register, logout, createStaff, getStaffs, getStaffById, updateStaff, deleteStaff, createPatient, getPatients, getPatient, updatePatient, deletePatient, revokeStaffAccess } from "../controller/hospital.js";

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/patients', getPatients)
router.get('/patient/:id', getPatient)
router.post('/new-patient', createPatient)
router.patch('/patient/:id', updatePatient)
router.delete('/patient/:id', deletePatient)
// router.get('/users', getAllUsers)
// router.get('/user/:id', getUser)
// router.delete('/user/:id', deleteUser)
router.post('/new-staff', createStaff)
router.get('/staffs', getStaffs)
router.get('/staff/:id', getStaffById)
router.patch('/staff/:id', updateStaff)
router.delete('/staff/:id', deleteStaff)
router.patch('/staff/:id', revokeStaffAccess)

export default router
