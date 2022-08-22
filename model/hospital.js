import Mongoose from 'mongoose'

const HospitalSchema = new Mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
        unique: true
    },
    hospitalAddress: {
        type: String,
        required: true
    },
    hospitalHotline: {
        type: String,
        required: true,
        unique: true
    },
    hospitalEmail: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    state_or_region: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    hospitalLicensedNumber: {
        type: String,
        required: true
    },
    hospitalSpeciality: {
        type: String,
        required: true
    },
    fullNameOfHospitalContactPerson: {
        type: String,
        required: true
    },
    contactPersonRegistrationNo: {
        type: String,
        required: true
    },
    contactPersonEmailAddress: {
        type: String,
        required: true
    },
    contactPersonPhoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

},
    { timestamps: true }
)

export default Mongoose.model("Hospital", HospitalSchema)
