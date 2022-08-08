import Mongoose from 'mongoose'

const HospitalSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'hospital'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default Mongoose.model("Hospital", HospitalSchema)
