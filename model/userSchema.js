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
    refreshTokens: {
      type: Array,
      default: [],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'nurse'],
      required: true
    },
    access: {
      type: Boolean,
      default: false,
    },
    hospital: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
