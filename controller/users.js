import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import user from "../model/userSchema.js";

// Get all user
export const getusers = async (req, res) => {
  try {
    const users = await user.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Get signle user
export const getuser = async (req, res) => {
  const { id } = req.params;

  try {
    const _user = await user.findById(id);

    res.status(200).json(_user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateuser = async (req, res) => {
  const { id: _id } = req.params;

  const { access } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updateduser = { access, _id: _id };

  await user.findByIdAndUpdate(_id, updateduser, {
    new: true,
  });

  res.json(updateduser);
};
