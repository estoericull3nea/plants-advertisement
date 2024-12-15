import Share from '../models/share.model.js'

export const trackShare = async (req, res) => {
  const { productId, userId } = req.body

  if (!productId || !userId) {
    return res
      .status(400)
      .json({ message: 'Product ID and User ID are required.' })
  }

  const existingShare = await Share.findOne({ productId, userId })
  if (existingShare) {
    return res.status(409).json({ message: 'Share already exists' })
  }

  const share = new Share({ productId, userId })
  await share.save()

  return res.status(201).json({ message: 'Share tracked successfully', share })
}

export const getSharesByUserId = async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' })
  }

  const shares = await Share.find({ userId })
    .populate('productId')
    .populate('userId')
    .sort({ createdAt: -1 })

  if (!shares || shares.length === 0) {
    return res
      .status(404)
      .json({ message: 'No shared posts found for this user.' })
  }

  return res.status(200).json({
    message: 'Shared posts retrieved successfully for this user.',
    shares,
  })
}

export const deleteShare = async (req, res) => {
  const { postId } = req.params

  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required.' })
  }

  const deletedShare = await Share.findByIdAndDelete(postId)

  if (!deletedShare) {
    return res.status(404).json({ message: 'Shared post not found.' })
  }

  return res.status(200).json({ message: 'Shared post deleted successfully.' })
}

export const getAllShares = async (req, res) => {
  try {
    // Fetch all shares from the database
    const shares = await Share.find()
      .populate('productId') // Populate product details
      .populate('userId') // Populate user details
      .sort({ createdAt: -1 }) // Sort by creation date in descending order

    if (!shares || shares.length === 0) {
      return res.status(404).json({ message: 'No shared posts found.' })
    }

    return res.status(200).json({
      message: 'All shared posts retrieved successfully.',
      shares,
    })
  } catch (error) {
    console.error('Error fetching shares:', error)
    return res
      .status(500)
      .json({ message: 'Server error while retrieving shares.' })
  }
}
