import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    message: {
      type: String,
      required: true,
      minlength: [10, 'Message must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Contact', contactSchema)
