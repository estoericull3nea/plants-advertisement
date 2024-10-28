import User from '../models/user.model.js'

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
  const idImage = req.file.path

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      contactNumber,
      idImage,
      municipality,
      barangay,
      password,
    })
    await newUser.save()
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Error registering user', error })
  }
}
