import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    idImage: { type: String, required: false },
    municipality: { type: String, required: true },
    barangay: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false },
    picture: { type: String, required: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
