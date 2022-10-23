import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import Admin from "../model/admin.js";
import Hospital from "../model/hospital.js";
import staff from "../model/staff.js";
import Patient from "../model/patient.js";
import JWT from "jsonwebtoken";

const refreshTokens = [];

export const signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const exitingUser = await Admin.findOne({ email });

    if (exitingUser)
      return res.status(404).json({ message: "Admin already exist" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Admin.create({
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ result });

    res.status(200).json({ message: 'Admin Successfully Register', token: accessToken });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exitingUser = await Admin.findOne({ email });

    if (!exitingUser)
      return res.status(404).json({ message: "Admin doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      exitingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });


    const accessToken = generateAccessToken({ exitingUser });
    const refreshToken = JWT.sign(
      { exitingUser },
      process.env.REFRESH_TOKEN_SECRET
    );

    refreshTokens.push(refreshToken);
    // const accessToken = exitingUser;
    res
      .status(200)
      .json({ message: 'Admin Successfully Logged in', token: accessToken });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

export const logout = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

  res.sendStatus(204);
};

function generateAccessToken(exitingUser) {
  return JWT.sign(exitingUser, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15h",
  });
}

export const getHospitals = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const hospitals = await Hospital.find();

    res.status(200).json(hospitals);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const getHospital = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const hospital = await Hospital.findById(req.params.id);

    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const revokeHospitalAccess = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { access } = req.body;
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, {
      access: access,
    });

    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const deleteHospital = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const getStaffs = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const staffs = await staff.find();

    res.status(200).json(staffs);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err)
  }
}

export const getStaffById = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const staff = await staff.findById(req.params.id);

    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const revokeStaffAccess = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const staff = await staff.findByIdAndUpdate(req.params.id, {
      access: false,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const deleteStaff = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const staff = await staff.findByIdAndDelete(req.params.id);

    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const getPatients = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });

  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const getPatient = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const patient = await Patient.findById(req.params.id);

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const revokePatientAccess = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, {
      access: false,
    });

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const deletePatient = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { role } = decoded.exitingUser;
  if (role !== "admin") return res.status(401).json({ message: "Unauthorized" });
  try {
    Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}