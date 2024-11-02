import Share from '../models/share.model.js'

export const trackShare = async (req, res) => {
  const { productId, userId } = req.body

  // Validate that productId and userId are provided
  if (!productId || !userId) {
    return res
      .status(400)
      .json({ message: 'Product ID and User ID are required.' })
  }

  try {
    // Create a new share document
    const share = new Share({ productId, userId })
    await share.save()

    return res
      .status(201)
      .json({ message: 'Share tracked successfully', share })
  } catch (error) {
    console.error('Error tracking share:', error)
    return res.status(500).json({ message: 'Error tracking share' })
  }
}
