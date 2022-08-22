import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    bp: {
      type: String,
    },
    genotype: {
      type: String,
    },
    height: {
      type: String,
    },
    nextOfKin: {
      type: String,
    },
    nextOfKinAddress: {
      type: String,
    },
    nextOfKinPhone: {
      type: String,
    },
    pulse: {
      type: String,
    },
    weight: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
