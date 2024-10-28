import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

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
  const updateData = { ...req.body } // Copy the request body

  // If the password is being updated, hash it
  if (updateData.password) {
    const saltRounds = 10 // Adjust the salt rounds as necessary
    updateData.password = await bcrypt.hash(updateData.password, saltRounds)
  } else {
    // If password is not being updated, remove it from the updateData
    delete updateData.password
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error updating user', error: error.message })
  }
}

export const getUserById = async (req, res) => {
  const { userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.status(200).json(user)
}
