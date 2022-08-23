import User from '../model/userSchema.js'
import Hospital from '../model/hospital.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
const refreshTokens = []

export const register = async (req, res) => {
    const {
        hospitalName,
        hospitalAddress,
        hospitalHotline,
        hospitalEmail,
        country,
        state_or_region,
        city,
        hospitalLicensedNumber,
        hospitalSpeciality,
        fullNameOfHospitalContactPerson,
        contactPersonRegistrationNo,
        contactPersonEmailAddress,
        contactPersonPhoneNumber, password,
    } = req.body
    try {
        const existingUser = await Hospital.findOne({ hospitalEmail })
        if (existingUser)
            return res.status(404).json({ message: "Hospital already exist" })
        const hashedPassword = await bcrypt.hash(password, 12)
        const hospital = await Hospital.create({
            hospitalEmail,
            password: hashedPassword,
            hospitalName,
            hospitalAddress,
            hospitalHotline,
            hospitalEmail,
            country,
            state_or_region,
            city,
            hospitalLicensedNumber,
            hospitalSpeciality,
            fullNameOfHospitalContactPerson,
            contactPersonRegistrationNo,
            contactPersonEmailAddress,
            contactPersonPhoneNumber
        })
        const token = jwt.sign({ hospital }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.status(201).json({ message: 'User created successfully', token })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const login = async (req, res) => {
    const { hospitalEmail, password } = req.body
    try {
        const hospital = await Hospital.findOne({ hospitalEmail })
        if (!hospital) return res.status(400).json({ message: 'Hospital not found' })
        const isPasswordCorrect = await bcrypt.compare(password, hospital.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid password' })
        const token = jwt.sign({ hospital }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: "User Successfully logged in", token })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const logout = (req, res) => {
    const refreshToken = req.body.refreshToken
    const token = refreshTokens.find(t => t === refreshToken)
    if (!token) return res.status(401).json({ message: 'Token not found' })
    refreshTokens.splice(refreshTokens.indexOf(token), 1)
    res.status(200).json({ message: 'Logged out' })
}

export const getHospitals = (req, res) => {
    try {
        Hospital.find({}).select('hospitalName')
            .then(hospitals => {
                res.status(200).json(hospitals)
            })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const getHospital = (req, res) => {
    const { id } = req.params
    try {
        Hospital.findById(id)
            .then(hospital => {
                res.status(200).json(hospital)
            }).catch(err => {
                res.status(500).json({ message: "Something went wrong" })
            })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}
export const createPatient = async (req, res) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const hospitalName = decoded.name
    const { name, phone, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(404).json({ message: "Patient already exist" })
        const hashedPassword = await bcrypt.hash(password, 12)
        const patient = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'patient',
            hospital: hospitalName
        })
        const token = jwt.sign({ role: patient.role, name: patient.name, email: patient.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.status(201).json({ message: 'User created successfully', token })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}