import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    municipality: { type: String, required: true },
    barangay: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false },
    bio: { type: String, required: false },

    lastActive: { type: Date, default: Date.now },

    isVerified: { type: Boolean, default: false },
    validIdUrl: { type: String, required: false },
    profilePictureUrl: { type: [String], required: false },
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
