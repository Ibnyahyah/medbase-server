import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
    },
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

export default mongoose.model("Record", RecordSchema);
