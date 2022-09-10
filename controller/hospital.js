import Patient from "../model/patient.js";
import staff from "../model/staff.js";
import Hospital from "../model/hospital.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const refreshTokens = [];

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
        contactPersonPhoneNumber,
        password,
    } = req.body;
    try {
        const existingUser = await Hospital.findOne({ hospitalEmail });
        if (existingUser)
            return res.status(404).json({ message: "Hospital already exist" });
        const hashedPassword = await bcrypt.hash(password, 12);
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
            contactPersonPhoneNumber,
        });
        const token = jwt.sign({ hospital }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ message: "Hospital created successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    const { hospitalEmail, password } = req.body;
    try {
        const hospital = await Hospital.findOne({ hospitalEmail });
        if (!hospital)
            return res.status(400).json({ message: "Hospital not found" });
        const isPasswordCorrect = await bcrypt.compare(password, hospital.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid password" });
        const token = jwt.sign({ hospital }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "Hospital Successfully logged in", token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const logout = (req, res) => {
    const refreshToken = req.body.refreshToken;
    const token = refreshTokens.find((t) => t === refreshToken);
    if (!token) return res.status(401).json({ message: "Token not found" });
    refreshTokens.splice(refreshTokens.indexOf(token), 1);
    res.status(200).json({ message: "Logged out" });
};

export const deleteHospital = async (req, res) => {
    const token = req?.headers?.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found" });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const hospitalName = decoded.hospitalName;
        const { id } = req.params.id;
        await Hospital.findAndDelete({ _id: id, hospital: hospitalName });
        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPatient = async (req, res) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.hospital.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    const {
        hospitalId,
        name,
        email,
        phone,
        gender,
        age,
        bloodGroup, dateOfBirth, address,
        bp,
        genotype,
        pulse,
        height,
        weight,
        nextOfKin,
        nextOfKinPhone,
        nextOfKinAddress,
        informationUsageAuthorization,
    } = req.body;
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const existingPatientEmail = await Patient.findOne({ email });
        const existingPatientPhone = await Patient.findOne({ phone });
        if (existingPatientEmail || existingPatientPhone)
            return res.status(404).json({ message: "Patient already exists" });
        const newPatient = await Patient.create({
            hospitalId,
            name,
            email,
            phone,
            gender,
            age,
            bloodGroup, dateOfBirth, address,
            bp,
            genotype,
            pulse,
            height,
            weight,
            nextOfKin,
            nextOfKinPhone,
            nextOfKinAddress,
            informationUsageAuthorization,
        });
        hospital.patients.push(newPatient);
        await hospital.save();
        res.status(201).json({ message: "Patient created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(err);
    }
};

export const getPatients = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const patients = await Patient.find({ hospitalId: hospital._id });
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getPatient = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        // const staff = await staff.findById(decoded.userResult);
        const patient = await Patient.findById(id);
        if (decoded?.hospital?.role !== "hospital" && patient.hospitalId !== hospital)
            return res.status(401).json({ message: "Unauthorized" });
        // if (patient.hospitalId !== staff.hospitalId && !patient.accessible) return res.status(403).json({ message: 'Unauthorized' });
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    const {
        name,
        email,
        phone,
        gender,
        age,
        bloodGroup, dateOfBirth, address,
        bp,
        genotype,
        pulse,
        height,
        weight,
        nextOfKin,
        nextOfKinPhone,
        nextOfKinAddress,
        informationUsageAuthorization,
    } = req.body;
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        patient.name = name;
        patient.email = email;
        patient.phone = phone;
        patient.gender = gender;
        patient.age = age;
        patient.dateOfBirth = dateOfBirth;
        patient.address = address;
        patient.bloodGroup = bloodGroup;
        patient.bp = bp;
        patient.genotype = genotype;
        patient.pulse = pulse;
        patient.height = height;
        patient.weight = weight;
        patient.nextOfKin = nextOfKin;
        patient.nextOfKinPhone = nextOfKinPhone;
        patient.nextOfKinAddress = nextOfKinAddress;
        patient.informationUsageAuthorization = informationUsageAuthorization;
        await patient.save();
        res.status(200).json({ message: "Patient updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const deletePatient = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.hospital.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        await patient.remove();
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const createStaff = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.hospital.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    const {
        name,
        email,
        phone,
        role,
        password,
        hospitalId,
        country,
        staffIDNo,
        professionalAssociationIDNo,
        affiliatedMedicalProfessionalAssociation,
        passport,
    } = req.body;
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const exitingUserEmail = await staff.findOne({ email });
        const exitingUserPhone = await staff.findOne({ phone });
        if (exitingUserEmail || exitingUserPhone)
            return res.status(404).json({ message: "Staff Already Exists" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newStaff = await staff.create({
            name,
            email,
            phone,
            hospitalId,
            role,
            country,
            staffIDNo,
            professionalAssociationIDNo,
            affiliatedMedicalProfessionalAssociation,
            passport,
            access: true,
            password: hashedPassword,
        });
        hospital.staffs.push(newStaff);
        await hospital.save();
        res.status(201).json({ message: "Staff created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(err)
    }
};

export const getStaffs = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });

        const staffs = await staff.find({ hospitalId: hospital._id });

        res.status(200).json(staffs);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getStaffById = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const savedStaff = await staff.findById(id);
        if (!savedStaff)
            return res.status(404).json({ message: "Staff not found" });
        res.status(200).json(savedStaff);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateStaff = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    const {
        phone,
        role,
        country,
        staffIDNo,
        professionalAssociationIDNo,
        affiliatedMedicalProfessionalAssociation,
    } = req.body;
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const _staff = await staff.findById(id);
        if (!_staff) return res.status(404).json({ message: "Staff not found" });
        _staff.phone = phone;
        _staff.role = role;
        _staff.country = country;
        _staff.staffIDNo = staffIDNo;
        _staff.professionalAssociationIDNo = professionalAssociationIDNo;
        _staff.affiliatedMedicalProfessionalAssociation =
            affiliatedMedicalProfessionalAssociation;
        await _staff.save();
        res.status(200).json({ message: "Staff updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(err);
    }
};

export const deleteStaff = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital")
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital)
            return res.status(404).json({ message: "Hospital not found" });
        const _staff = await staff.findById(id);
        if (!_staff) return res.status(404).json({ message: "Staff not found" });
        await _staff.remove();
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const revokeStaffAccess = async (req, res) => {
    const { id } = req.params;
    const {
        access,
    } = req.body;
    const token = req.headers?.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded?.hospital?.role !== "hospital") return res.status(403).json({ message: "Unauthorized" });
    try {
        const hospital = await Hospital.findById(decoded.hospital._id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
        const _staff = await staff.findById(id);
        if (!_staff) return res.status(404).json({ message: "Staff not found" });
        _staff.access = access;
        await _staff.save();
        res.status(200).json({ message: "Staff Revoked" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error)
    }
}