import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import UsersRoutes from "./routes/users.js";
import AdminsRoutes from "./routes/admins.js";
import RecordsRoutes from "./routes/records.js";
import CommentsRoutes from "./routes/comment.js";
// config

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/auth", UsersRoutes);
app.use("/api/v1/admin", AdminsRoutes);
app.use("/api/v1/records", RecordsRoutes);
app.use("/api/v1/comment", CommentsRoutes);

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
