import User from '../model/userSchema';
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
        contactPersonPhoneNumber, password
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
        res.status(500).json({ message: "Something went wrong", })
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

export const deleteUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const { id } = req.params.id
        await User.findAndDelete({ _id: id, hospital: hospitalName })
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const getAllUsers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const users = await User.find({ hospital: hospitalName })
        res.status(200).json({ users })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const getUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const { id } = req.params.id
        const user = await User.findOne({ _id: id, hospital: hospitalName })
        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const updateUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const { id } = req.params.id
        const { email,
            name,
            phone,
            hospital,
            role,
            country,
            staffIDNo,
            professionalAssociationIDNo,
            affiliatedMedicalProfessionalAssociation,
            passport, } = req.body
        const user = await User.findOneAndUpdate({ _id: id, hospital: hospitalName }, {
            email,
            name,
            phone,
            hospital,
            role,
            country,
            staffIDNo,
            professionalAssociationIDNo,
            affiliatedMedicalProfessionalAssociation,
            passport,
        })
        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

