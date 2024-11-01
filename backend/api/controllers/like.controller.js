import Like from '../models/like.model.js'

export const likeProduct = async (req, res) => {
  const { userId, productId } = req.body

  try {
    const existingLike = await Like.findOne({ userId, productId })
    if (existingLike) {
      return res
        .status(400)
        .json({ message: 'You already liked this product.' })
    }

    const newLike = new Like({ userId, productId })
    await newLike.save()
    res.status(201).json({ message: 'Product liked successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Server error.' })
  }
}
