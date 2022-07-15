import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
    },
    refreshTokens: {
      type: Array,
      default: [],
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

export default mongoose.model("user", userSchema);
