<<<<<<< HEAD
import User from '../model/userSchema';
=======
import Patient from '../model/patient.js'
import User from '../model/userSchema.js'
>>>>>>> ibro
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

<<<<<<< HEAD
export const deleteUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const { id } = req.params.id
        await User.findAndDelete({ _id: id, hospital: hospitalName })
        res.status(200).json({ message: 'User deleted successfully' })
=======
export const createPatient = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    const { name, email, phone, gender, age, bloodGroup, bp, genotype, height, nextOfKin, nextOfKinPhone, nextOfKinAddress, pulse, weight } = req.body
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const newPatient = await Patient.create({
            name,
            email,
            phone,
            gender, age, bloodGroup, bp, genotype, height, nextOfKin, nextOfKinPhone, nextOfKinAddress, pulse, weight
        })
        hospital.patients.push(newPatient)
        await hospital.save()
        res.status(201).json({ message: 'Patient created successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}
export const getPatients = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const patients = await Patient.find({ hospital: hospital._id })
        res.status(200).json(patients)
>>>>>>> ibro
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

<<<<<<< HEAD
export const getAllUsers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Token not found' })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const hospitalName = decoded.hospitalName
        const users = await User.find({ hospital: hospitalName })
        res.status(200).json({ users })
=======
export const getPatient = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const patient = await Patient.findById(id)
        if (!patient) return res.status(404).json({ message: 'Patient not found' })
        res.status(200).json(patient)
>>>>>>> ibro
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

<<<<<<< HEAD
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
=======
export const updatePatient = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    const { name, email, phone, gender, age, bloodGroup, bp, genotype, height, nextOfKin, nextOfKinPhone, nextOfKinAddress, pulse, weight } = req.body
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const patient = await Patient.findById(id)
        if (!patient) return res.status(404).json({ message: 'Patient not found' })
        patient.name = name
        patient.email = email
        patient.phone = phone
        patient.gender = gender
        patient.age = age
        patient.bloodGroup = bloodGroup
        patient.bp = bp
        patient.genotype = genotype
        patient.height = height
        patient.nextOfKin = nextOfKin
        patient.nextOfKinPhone = nextOfKinPhone
        patient.nextOfKinAddress = nextOfKinAddress
        patient.pulse = pulse
        patient.weight = weight
        await patient.save()
        res.status(200).json({ message: 'Patient updated successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const deletePatient = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const patient = await Patient.findById(id)
        if (!patient) return res.status(404).json({ message: 'Patient not found' })
        await patient.remove()
        res.status(200).json({ message: 'Patient deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const createStaff = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    const { name, email, phone, role, access, password} = req.body
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const newStaff = await Staff.create({
>>>>>>> ibro
            name,
            email,
            phone,
<<<<<<< HEAD
            hospital,
            role,
            country,
            staffIDNo,
            professionalAssociationIDNo,
            affiliatedMedicalProfessionalAssociation,
            passport,
        })
        res.status(200).json({ user })
=======
            role, 
            access, 
            password,
            hospital: hospital.name
        })
        hospital.staff.push(newStaff)
        await hospital.save()
        res.status(201).json({ message: 'Staff created successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const getStaff = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const staff = await Staff.find({ hospital: hospital._id })
        res.status(200).json(staff)
>>>>>>> ibro
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

<<<<<<< HEAD
=======
export const getStaffById = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const staff = await Staff.findById(id)
        if (!staff) return res.status(404).json({ message: 'Staff not found' })
        res.status(200).json(staff)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const updateStaff = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    const { name, email, phone, role, access  } = req.body
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const staff = await Staff.findById(id)
        if (!staff) return res.status(404).json({ message: 'Staff not found' })
        staff.name = name
        staff.email = email
        staff.phone = phone
        staff.role = role
        staff.access = access
        await staff.save()
        res.status(200).json({ message: 'Staff updated successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const deleteStaff = async (req, res) => {
    const { id } = req.params
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (decoded.role !== 'hospital') return res.status(401).json({ message: 'Unauthorized' })
    try {
        const hospital = await Hospital.findById(decoded.id)
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' })
        const staff = await Staff.findById(id)
        if (!staff) return res.status(404).json({ message: 'Staff not found' })
        await staff.remove()
        res.status(200).json({ message: 'Staff deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

>>>>>>> ibro
