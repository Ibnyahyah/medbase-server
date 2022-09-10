import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import StaffsRoutes from "./routes/staffs.js";
import AdminsRoutes from "./routes/admins.js";
import PatientRoutes from "./routes/patient.js";
import CommentsRoutes from "./routes/comment.js";
import HospitalRoutes from "./routes/hospital.js"
// config

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/staff", StaffsRoutes);
app.use("/api/v1/admin", AdminsRoutes);
app.use("/api/v1/patients", PatientRoutes);
app.use("/api/v1/comment", CommentsRoutes);
app.use("/api/v1/hospital", HospitalRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome to server");
});

const PORT = process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("Server Running on port: " + PORT))
  )
  .catch((err) => console.log(err));
