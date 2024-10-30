import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total: { type: Number, default: 0 },
})

export default mongoose.model('Cart', cartItemSchema)
