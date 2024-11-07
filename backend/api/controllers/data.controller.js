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

export const getAllUsers = async (req, res) => {
  const users = await User.find()
  if (!users) {
    return res.status(404).json({ message: 'No users found' })
  }
  res.status(200).json(users)
}

export const getUserRegistrationsForChart = async (req, res) => {
  const today = new Date()

  const dailyRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 30
          ),
        },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ])

  const weeklyRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 90
          ),
        },
      }, // last 90 days
    },
    {
      $group: {
        _id: { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
  ])

  const monthlyRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(today.getFullYear() - 1, today.getMonth()),
        },
      }, // last 12 months
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  const yearlyRegistrations = await User.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1 } },
  ])

  // Format the data for Chart.js
  const formatData = (data, label) => ({
    label,
    data: data.map((item) => item.count),
    labels: data.map((item) =>
      `${item._id.year}-${item._id.month || ''}-${item._id.day || ''}`.trim()
    ),
  })

  const responseData = {
    daily: formatData(dailyRegistrations, 'Daily Registrations'),
    weekly: formatData(weeklyRegistrations, 'Weekly Registrations'),
    monthly: formatData(monthlyRegistrations, 'Monthly Registrations'),
    yearly: formatData(yearlyRegistrations, 'Yearly Registrations'),
  }

  res.status(200).json(responseData)
}

export const getAverageProductPosts = async (req, res) => {
  try {
    const today = new Date()

    // Daily Aggregation (Last 30 days)
    const dailyPosts = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 30
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ])

    // Weekly Aggregation (Last 12 weeks)
    const weeklyPosts = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 84
            ),
          },
        },
      },
      {
        $group: {
          _id: { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ])

    // Monthly Aggregation (Last 12 months)
    const monthlyPosts = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear() - 1, today.getMonth()),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    // Yearly Aggregation (All-time)
    const yearlyPosts = await Product.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1 } },
    ])

    const formatData = (data, label) => ({
      label,
      data: data.map((item) => item.count),
      labels: data.map((item) =>
        `${item._id.year}-${item._id.month || ''}-${item._id.day || ''}`.trim()
      ),
    })

    const responseData = {
      daily: formatData(dailyPosts, 'Daily Posts'),
      weekly: formatData(weeklyPosts, 'Weekly Posts'),
      monthly: formatData(monthlyPosts, 'Monthly Posts'),
      yearly: formatData(yearlyPosts, 'Yearly Posts'),
    }

    res.status(200).json(responseData)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching average product post data', error })
  }
}
