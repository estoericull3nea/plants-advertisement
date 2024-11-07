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
  const topUsers = await User.find().sort({ createdAt: -1 }).limit(5)

  return res.status(200).json(topUsers)
}

export const getTop5RecentProducts = async (req, res) => {
  const recentProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'firstName lastName email')
    .exec()

  res.status(200).json(recentProducts)
}

export const getLatestChats = async (req, res) => {
  const latestChats = await Message.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'sender',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'receiverId',
        foreignField: '_id',
        as: 'receiver',
      },
    },
    {
      $project: {
        senderId: 1,
        receiverId: 1,
        text: 1,
        images: 1,
        productPreview: 1,
        sender: { firstName: 1, email: 1, lastName: 1 },
        receiver: { firstName: 1, email: 1, lastName: 1 },
        createdAt: 1,
      },
    },
  ])

  if (!latestChats || latestChats.length === 0) {
    return res.status(404).json({ message: 'No chats found' })
  }

  return res.status(200).json(latestChats)
}
