import express from 'express';
const router = express.Router()
import {login, register, logout, getAllUsers, getUser, deleteUser } from "../controller/hospital.js";
import {createPatient, getPatient, getPatients, updatePatient, deletePatient} from "../controller/patient.js";


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


export default router
