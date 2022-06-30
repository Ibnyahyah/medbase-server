import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Doctor from "../model/doctorSchema.js";

export const signup = async (req, res) => {
  const { email, password, name, phone, confirmPassword } = req.body;

  try {
    const exitingUser = await Doctor.findOne({ email });

    if (exitingUser)
      return res.status(404).json({ message: "User already exist" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Doctor.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exitingUser = await Doctor.findOne({ email });

    if (!exitingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      exitingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });

    res.status(200).json({ result: exitingUser });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
// Get all doctor
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get signle Doctor
export const getDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);

    res.status(200).json(doctor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { id: _id } = req.params;

  const { access } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedDoctor = { access, _id: _id };

  await Doctor.findByIdAndUpdate(_id, updatedDoctor, {
    new: true,
  });

  res.json(updatedDoctor);
};
