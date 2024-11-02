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
