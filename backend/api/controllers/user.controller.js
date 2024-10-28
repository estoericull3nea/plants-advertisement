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
