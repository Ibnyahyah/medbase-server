import express from 'express';
const router = express.Router()
import {login, register, logout, getAllUsers, getUser, deleteUser } from "../controller/hospital.js";
import {createPatient, getPatient, getPatients, updatePatient, deletePatient} from "../controller/patient.js";
import {login, register, logout, createStaff, getStaff, getStaffById, updateStaff, deleteStaff, createPatient, getPatients, getPatient, updatePatient, deletePatient} from "../controller/hospital.js";

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/patients', getPatients)
router.get('/patient/:id', getPatient)
router.post('/patient', createPatient)
router.put('/patient/:id', updatePatient)
router.delete('/patient/:id', deletePatient)
router.get('/users', getAllUsers)
router.get('/user/:id', getUser)
router.delete('/user/:id', deleteUser)
router.post('/new-patient', createPatient)
router.get('/patients', getPatients)
router.get('/patients/:id', getPatient)
router.put('/patients/:id', updatePatient)
router.delete('/patients/:id', deletePatient)
router.post('/new-staff', createStaff)
router.get('/staff', getStaff)
router.get('/staff/:id', getStaffById)
router.put('/staff/:id', updateStaff)
router.delete('/staff/:id', deleteStaff)

export default router
