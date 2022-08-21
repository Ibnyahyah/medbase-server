import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Medical Director', 'General Doctor', 'Radiologist', 'Nurse', 'Therapist', 'Anaesthesiologist', 'Pharmacist', 'Resident', 'General Surgeon', 'Specialised Surgeon'],
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    staffIDNo: {
      type: String,
      required: true,
    },
    affiliatedMedicalProfessionalAssociation: {
      type: String,
      required: true,
    },
    professionalAssociationIDNo: {
      type: String,
      required: true,
    },
    passport: {
      type: String,
      required: true,
    },
    refreshTokens: {
      type: Array,
      default: [],
    },
    password: {
      type: String,
      required: true,
    },
    access: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
