import mongoose from 'mongoose'

const paymentLinkSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    remarks: { type: String, required: true },
    paymongo_id: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    payment_url: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userWhoPosted: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('PaymentLink', paymentLinkSchema)
