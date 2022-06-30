import bcrypt from "bcrypt";
import Admin from "../model/admin.js";

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

    res.status(200).json({ result });
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

    res.status(200).json({ result: exitingUser });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
