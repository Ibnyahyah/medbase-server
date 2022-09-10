import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    isMaster: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
