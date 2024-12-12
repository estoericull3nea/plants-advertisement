import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    municipality,
    barangay,
    password,
  } = req.body

  const idImage = req.file ? req.file.path : null

  const errors = []

  if (!firstName) {
    errors.push({ msg: 'First name is required' })
  }
  if (!lastName) {
    errors.push({ msg: 'Last name is required' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ msg: 'Invalid email format' })
  }
  if (!contactNumber || !/^09\d{9}$/.test(contactNumber)) {
    errors.push({
      msg: 'Invalid contact number. Must start with "09" and have 11 digits.',
    })
  }
  if (!municipality) {
    errors.push({ msg: 'Municipality is required' })
  }
  if (!barangay) {
    errors.push({ msg: 'Barangay is required' })
  }
  if (!password || password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' })
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Email already registered' }] })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    firstName,
    lastName,
    email,
    contactNumber,
    idImage,
    municipality,
    barangay,
    password: hashedPassword,
  })

  await newUser.save()
  res
    .status(201)
    .json({ message: 'User registered successfully', user: newUser })
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  // Find the user by email
  const user = await User.findOne({ email })

  // If user doesn't exist or password is incorrect, return an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  // Check if the user is disabled
  if (!user.isEnabled) {
    return res
      .status(403)
      .json({ message: 'Account is disabled. Please contact support.' })
  }

  // Update the last active time of the user
  user.lastActive = new Date()
  await user.save()

  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  // Send the token in the response
  res.status(200).json({ token })
}
