import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    access: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
