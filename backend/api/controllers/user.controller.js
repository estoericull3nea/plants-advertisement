import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { uploadImage } from '../services/imageKit.service.js'

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

  // Handle profile picture upload (if present)
  if (req.files && req.files.profilePicture) {
    try {
      const profilePictureUrl = await uploadImage(
        req.files.profilePicture[0].buffer,
        req.files.profilePicture[0].originalname
      )
      // Push the new profile picture URL into the existing array
      updateData.$push = { profilePictureUrl: profilePictureUrl }
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to upload profile picture' })
    }
  }

  // Handle valid ID upload (if present)
  if (req.files && req.files.validId) {
    try {
      const validIdUrl = await uploadImage(
        req.files.validId[0].buffer,
        req.files.validId[0].originalname
      )
      updateData.validIdUrl = validIdUrl
    } catch (error) {
      return res.status(500).json({ message: 'Failed to upload valid ID' })
    }
  }

  try {
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to update user' })
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

export const searchUsers = async (req, res) => {
  const searchQuery = req.query.q || '' // Extract the search query from the request

  try {
    // Perform a case-insensitive search on firstName and lastName fields
    const users = await User.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
      ],
    }).select('firstName lastName email profilePictureUrl lastActive') // Select specific fields

    res.status(200).json(users)
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
