import Like from '../models/like.model.js'

export const likeProduct = async (req, res) => {
  const { userId, productId, action } = req.body

  if (action === 'like') {
    const newLike = new Like({ userId, productId })
    await newLike.save()
    return res.status(201).json({ message: 'Product liked successfully.' })
  } else if (action === 'dislike') {
    return res.status(200).json({ message: 'Product disliked successfully.' })
  } else {
    return res.status(400).json({ message: 'Invalid action.' })
  }
}

export const getLikesForProduct = async (req, res) => {
  const { productId } = req.params

  const likes = await Like.find({ productId }).populate('userId')
  res.status(200).json(likes)
}

export const getLikesForUser = async (req, res) => {
  const { userId } = req.params

  const likes = await Like.find({ userId }).populate('productId')
  res.status(200).json(likes)
}

export const checkIfLiked = async (req, res) => {
  const { userId, productId } = req.params

  const existingLike = await Like.find({ userId, productId })
  return res.status(200).json(existingLike)
}
