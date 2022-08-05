import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import user from "../model/userSchema.js";

import JWT from "jsonwebtoken";

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
    (err, usertoken) => {
      if (err)
        return res
          .sendStatus(403)
          .json("Error: Can't refresh this token / invalid secret");

      const accessToken = generateAccessToken({ userResult: usertoken });

      return res.json({ accessToken: accessToken });
    }
  );
};

export const signup = async (req, res) => {
  const { email, password, name, phone, confirmPassword} = req.body;

  try {
    const existingUser = await user.findOne({ email });

    if (existingUser)
      return res.status(404).json({ message: "User already exist" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const userResult = await user.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'patient'
    });

    const accessToken = generateAccessToken({ userResult });

    // const accessToken = userResult;
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await user.findOne({ email });

    if (!userResult)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userResult.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid password" });

    const accessToken = generateAccessToken({ userResult });
    const refreshToken = JWT.sign(
      { userResult },
      process.env.REFRESH_TOKEN_SECRET
    );

    refreshTokens.push(refreshToken);
    // const accessToken = exitingUser;
    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    res.status(500).json("Error :" + err, "Something went wrong");
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
