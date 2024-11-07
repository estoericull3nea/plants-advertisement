import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import Message from '../models/chat.model.js'

export const countUsers = async (req, res) => {
  const userCount = await User.countDocuments()
  const verifiedCount = await User.countDocuments({ isVerified: true })
  const nonVerifiedCount = await User.countDocuments({ isVerified: false })

  return res.status(200).json({
    userCount,
    verifiedCount,
    nonVerifiedCount,
  })
}

export const countProducts = async (req, res) => {
  const productCount = await Product.countDocuments()
  const availableCount = await Product.countDocuments({ isAvailable: true })
  const unavailableCount = await Product.countDocuments({
    isAvailable: false,
  })

  return res.status(200).json({
    productCount,
    availableCount,
    unavailableCount,
  })
}

export const countChats = async (req, res) => {
  const totalChats = await Message.countDocuments()

  return res.status(200).json({
    totalChats,
  })
}
