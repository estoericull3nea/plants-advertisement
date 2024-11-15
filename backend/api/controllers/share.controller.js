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
