import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String },
    category: {
      type: String,
      enum: ['crops', 'fisheries', 'livestock', 'uncategorized'],
      required: true,
    },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [String],
    quantity: { type: Number, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: { type: String, required: false },
    isAvailable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)
export default mongoose.model('Product', productSchema)
