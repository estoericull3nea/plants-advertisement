import mongoose from 'mongoose'

const shareSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Share', shareSchema)
