import User from '../models/user.model.js'

export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany()
    res.status(200).json({ message: 'All users deleted successfully', result })
  } catch (error) {
    console.error('Error deleting users:', error)
    res.status(500).json({ message: 'Error deleting users', error })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()

    // Check if the users array is empty
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' })
    }

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Error fetching users', error })
  }
}
