import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import DoctorsRoutes from "./routes/doctors.js";
import AdminsRoutes from "./routes/admins.js";
// config

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/auth", DoctorsRoutes);
app.use("/api/v1/admin", AdminsRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome to server");
});

const PORT = 5000 || process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("Server Running on port: " + PORT))
  )
  .catch((err) => console.log(err));
