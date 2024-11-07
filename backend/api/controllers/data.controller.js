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

export const getTop5RecentUsers = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ createdAt: -1 }).limit(5)

    return res.status(200).json(topUsers)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch top 5 recent users' })
  }
}

export const getTop5RecentProducts = async (req, res) => {
  const recentProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'firstName lastName email')
    .exec()

  res.status(200).json(recentProducts)
}
