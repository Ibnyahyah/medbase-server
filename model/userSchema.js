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
    country: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Medical Director', 'Admin Officer', 'General Doctor', 'Radiologist', 'Nurse', 'Therapist', 'Anaesthesiologist', 'Pharmacist', 'Resident', 'General Surgeon', 'Specialised Surgeon']
    },
    hospitalName: {
      type: String,
    },
    staffIDNo: {
      type: String,
    },
    affiliatedMedicalProfessionalAssociation: {
      type: String,
    },
    professionalAssociationIDNo: {
      type: String,
    },
    passport: {
      type: String,
    },
    refreshTokens: {
      type: Array,
      default: [],
    },
    password: {
      type: String,
    }, confirmPassword: {
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
