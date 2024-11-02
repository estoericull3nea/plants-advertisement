import Like from '../models/like.model.js'
import Product from '../models/product.model.js'

export const toggleLikeProduct = async (req, res) => {
  const { userId, productId } = req.body

  const existingLike = await Like.findOne({ userId, productId })

  if (existingLike) {
    // User wants to dislike (remove the like)
    await Like.findOneAndDelete({ userId, productId })
    return res.status(200).json({ message: 'Product disliked successfully.' })
  } else {
    // User wants to like (add the like)
    const newLike = new Like({ userId, productId })
    await newLike.save()
    await Product.findByIdAndUpdate(productId, { $inc: { likeCount: 1 } })
    return res.status(201).json({ message: 'Product liked successfully.' })
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

export const countLikes = async (req, res) => {
  const { productId } = req.params

  const likeCount = await Like.countDocuments({ productId })
  return res.status(200).json({ count: likeCount })
}

export const getLikesByProductId = async (req, res) => {
  const { productId } = req.params

  const likes = await Like.find({ productId }).populate('userId')

  res.status(200).json(likes)
}
