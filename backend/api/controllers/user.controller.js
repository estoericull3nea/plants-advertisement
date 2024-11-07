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
  let updateData = { ...req.body }

  if (updateData.newPassword) {
    const hashedPassword = await bcrypt.hash(updateData.newPassword, 10)
    updateData.password = hashedPassword
    delete updateData.newPassword
  }

  if (!updateData.newPassword) {
    delete updateData.newPassword
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  })

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json(updatedUser)
}

export const getUserById = async (req, res) => {
  const { userId } = req.params

  const user = await User.findById(userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.status(200).json(user)
}

export const deleteUserById = async (req, res) => {
  const { userId } = req.params

  const user = await User.findByIdAndDelete(userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(200).json({ message: 'User deleted successfully' })
}

export const addUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    municipality,
    barangay,
    password,
    idImage,
    dateOfBirth,
    age,
    picture,
    isVerified,
  } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ msg: 'User with this email already exists.' })
  }

  // Hash password before saving to the database

  const hashedPassword = await bcrypt.hash(password, 10)

  // Create a new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    contactNumber,
    idImage,
    municipality,
    barangay,
    password: hashedPassword,
    dateOfBirth,
    age,
    picture,
    isVerified,
  })

  // Save the user to the database
  await newUser.save()
  res.status(201).json(newUser)
}
