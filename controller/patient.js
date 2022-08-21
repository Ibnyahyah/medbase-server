import Patient from "../model/patient.js";
import Hospital from "../model/hospital.js";

export const createPatient = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not found' })
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const hospitalName = decoded.name
  const { name, email, phone, gender, age, bloodGroup, bp, genotype, height, nextOfKin, nextOfKinAddress, nextOfKinPhone, pulse, weight } = req.body
  try {
    const existingUser = await Patient.findOne({ email })
    if (existingUser)
      return res.status(404).json({ message: "Patient already exist" })
    const patient = await Patient.create({
      name,
      email,
      phone,
      gender,
      age,
      bloodGroup,
      bp,
      genotype,
      height,
      nextOfKin,
      nextOfKinAddress,
      nextOfKinPhone,
      pulse,
      weight,
      hospital: hospitalName
    })
    res.status(201).json({ message: 'Patient created successfully', patient })
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

export const getPatients = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not found' })
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const hospitalName = decoded.hospitalName
    const hospital = await Hospital.findOne({ hospitalName })
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    if (hospital === hospitalName) {
      const patients = await Patient.find({ hospital: hospitalName })
      res.status(200).json(patients)
    } else {
      res.status(401).json({ message: "You are not authorized to view this data" })
    }
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any Patients");
    console.log(error);
  }
};
export const getPatient = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not found' })
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const hospitalName = decoded.name
    const hospital = await Hospital.findOne({ hospitalName })
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    if (hospital === hospitalName) {
      const { id } = req.params
      const patient = await Patient.findOne({ _id: id, hospital: hospitalName })
      res.status(200).json(patient)
    } else {
      res.status(401).json({ message: "You are not authorized to view this data" })
    }
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any Patients");
    console.log(error);
  }
};
export const updatePatient = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not found' })
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const hospitalName = decoded.name
    const hospital = await Hospital.findOne({ hospitalName })
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    if (hospital === hospitalName) {
      const { id } = req.params
      const { name, email, phone, gender, age, bloodGroup, bp, genotype, height, nextOfKin, nextOfKinAddress, nextOfKinPhone, pulse, weight } = req.body
      const patient = await Patient.findOneAndUpdate({ _id: id, hospital: hospitalName }, {
        name,
        email,
        phone,
        gender,
        age,
        bloodGroup,
        bp,
        genotype,
        height,
        nextOfKin,
        nextOfKinAddress,
        nextOfKinPhone,
        pulse,
        weight
      })
      res.status(200).json(patient)
    } else {
      res.status(401).json({ message: "You are not authorized to view this data" })
    }
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any Patients");
    console.log(error);
  }
}
export const deletePatient = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token not found' })
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const hospitalName = decoded.name
    const hospital = await Hospital.findOne({ hospitalName })
    if (!hospital) return res.status(404).json({ message: "Hospital not found" })
    if (hospital === hospitalName) {
      const { id } = req.params
      const patient = await Patient.findOneAndDelete({ _id: id, hospital: hospitalName })
      res.status(200).json(patient)
    } else {
      res.status(401).json({ message: "You are not authorized to view this data" })
    }
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any Patients");
    console.log(error);
  }
}