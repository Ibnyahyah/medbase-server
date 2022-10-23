import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import staff from "../model/staff.js";

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


function generateAccessToken(exitingstaff) {
  return JWT.sign(exitingstaff, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}
