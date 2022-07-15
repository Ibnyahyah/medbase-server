import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import Admin from "../model/admin.js";

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

    res.status(200).json({ accessToken: accessToken });
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
      .json({ accessToken: accessToken, refreshToken: refreshToken });
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
