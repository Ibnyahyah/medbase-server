import express from 'express';
const router = express.Router()
import {login, register, logout, getHospitals, getHospital, createPatient} from "../controller/hospital.js";

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/hospitals', getHospitals)
router.get('/:id', getHospital)
router.post('/new-patient', createPatient)

export default router
