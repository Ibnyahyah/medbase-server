import mongoose from "mongoose";


const PatientSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    bp: {
      type: String,
      required: true,
    },
    genotype: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    nextOfKin: {
      type: String,
      required: true,
    },
    nextOfKinAddress: {
      type: String,
      required: true,
    },
    nextOfKinPhone: {
      type: String,
      required: true,
    },
    pulse: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Patient", PatientSchema);

