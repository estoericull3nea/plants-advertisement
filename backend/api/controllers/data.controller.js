import User from '../models/user.model.js'

export const countUsers = async (req, res) => {
  const userCount = await User.countDocuments()
  return res.status(200).json({
    count: userCount,
  })
}
