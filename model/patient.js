import mongoose from "mongoose";

<<<<<<< HEAD:model/patient.js
const RecordSchema = new mongoose.Schema(
=======
const PatientSchema = new mongoose.Schema(
>>>>>>> ibro:model/record.js
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

<<<<<<< HEAD:model/patient.js
export default mongoose.model("Record", RecordSchema);
=======
export default mongoose.model("Patient", PatientSchema);
>>>>>>> ibro:model/record.js
