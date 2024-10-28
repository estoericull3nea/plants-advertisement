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

  const idImage = req.file ? req.file.path : null // Ensure idImage is set if file exists

  // Manual validations
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
    // Validate contact number: must start with '09' and followed by 9 digits
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
  if (!password || password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

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
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Error registering user', error })
  }
}
