import User from '../models/user.model.js'

export const deleteAllUsers = async (req, res) => {
  const result = await User.deleteMany()
  res.status(200).json({ message: 'All users deleted successfully', result })
}

export const getAllUsers = async (req, res) => {
  const users = await User.find()

  // Check if the users array is empty
  if (users.length === 0) {
    return res.status(404).json({ message: 'No users found' })
  }

  res.status(200).json(users)
}
