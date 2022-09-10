import dotenv from "dotenv";
dotenv.config();

import JWT from "jsonwebtoken";
import bcrypt from 'bcrypt';

import staff from "../model/staff.js";
import Patient from '../model/patient.js'

const refreshTokens = [];

export const refreshToken = (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null)
    return res.sendStatus(401).json("Error: token is null");
  if (!refreshTokens?.includes(refreshToken))
    return res.sendStatus(401).json("Error: Can't refresh this token");

  JWT.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, stafftoken) => {
      if (err)
        return res
          .sendStatus(403)
          .json("Error: Can't refresh this token / invalid secret");

      const accessToken = generateAccessToken({ staffResult: stafftoken });

      return res.json({ accessToken: accessToken });
    }
  );
};

export const signup = async (req, res) => {
  const {
    email, confirmPassword,
    password,
    name,
    phone,
    hospitalName,
    role,
    country,
    staffIDNo,
    professionalAssociationIDNo,
    affiliatedMedicalProfessionalAssociation,
    passport,
  } = req.body;

  try {
    const existingstaff = await staff.findOne({ email });

    if (existingstaff)
      return res.status(404).json({ message: "staff already exist" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const staffResult = await staff.create({
      email,
      password: hashedPassword,
      name,
      phone,
      hospitalName,
      role,
      country,
      staffIDNo,
      professionalAssociationIDNo,
      affiliatedMedicalProfessionalAssociation,
      passport,
    });

    const accessToken = generateAccessToken({ staffResult });

    res.status(200).json({ message: 'staff Successfully Register', token: accessToken });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staffResult = await staff.findOne({ email });

    if (!staffResult)
      return res.status(404).json({ message: "staff doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      staffResult.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });

    const accessToken = generateAccessToken({ staffResult });
    const refreshToken = JWT.sign(
      { staffResult },
      process.env.REFRESH_TOKEN_SECRET
    );

    refreshTokens.push(refreshToken);
    res
      .status(200)
      .json({ message: 'staff Successfully Logged in', token: accessToken });
  } catch (err) {
    res.status(500).json("Error :" + err, "Something went wrong");
  }
};

export const logout = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = refreshToken.find(t => t === refreshToken);
  if (!token) return res.status(401).json({ message: 'Token not found' });
  refreshToken.splice(refreshToken.indexOf(token), 1);
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

function generateAccessToken(exitingstaff) {
  return JWT.sign(exitingstaff, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}



export const getPatients = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  try {
    const _staff = await staff.findById(decoded.staffResult._id);

    const patient = await Patient.find({ hospitalId: _staff.hospitalId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // checking if the patient can be use or access by the staff of the hospital
    // if (!patient.accessible) return res.status(403).json({ message: 'Unauthorized' });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
    console.log(err)
  }
}
export const getPatient = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  try {
    const _staff = await staff.findById(decoded.staffResult._id);

    const patient = await Patient.findById(id);
    if (patient.hospitalId !==_staff.hospitalId) return res.status(403).json({ message: 'UnAuthorized'});
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' })
    console.log(err)
  }
}