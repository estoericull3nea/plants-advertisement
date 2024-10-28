import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String },
  category: {
    type: String,
    enum: ['crops', 'fisheries', 'livestock', 'uncategorized'],
    required: true,
  },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  quantity: { type: Number, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
})
export default mongoose.model('Product', productSchema)
