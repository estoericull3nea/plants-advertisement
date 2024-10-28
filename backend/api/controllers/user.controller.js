import User from '../models/user.model.js'

export const deleteAllUsers = async (req, res) => {
  const result = await User.deleteMany()
  res.status(200).json({ message: 'All users deleted successfully', result })
}

export const getAllUsers = async (req, res) => {
  const users = await User.find()

  if (users.length === 0) {
    return res.status(404).json({ message: 'No users found' })
  }

  res.status(200).json(users)
}

export const updateUserById = async (req, res) => {
  const { userId } = req.params
  const updateData = req.body

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json(updatedUser)
}
