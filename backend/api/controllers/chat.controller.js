import Message from '../models/chat.model.js'
import User from '../models/user.model.js'
import Product from '../models/product.model.js'

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body
  const senderId = req.user

  const images =
    req.files && req.files.length > 0
      ? req.files.map((file) => file.path)
      : null

  let productPreview = null
  let productId = null

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = text.match(urlRegex)

  if (urls && urls.length > 0) {
    const productUrl = urls[0]

    const productIdRegex = /\/products\/([a-z0-9]{24})/i
    const match = productUrl.match(productIdRegex)

    if (match) {
      productId = match[1]

      try {
        const product = await Product.findById(productId)

        if (product) {
          productPreview = {
            title: product.title,
            description: product.caption,
            image: product.images[0],
            url: productUrl,
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
      }
    }
  }

  try {
    const message = new Message({
      senderId,
      receiverId,
      text,
      images,
      product: productId || null,
      productPreview,
    })

    await message.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId')
      .populate('receiverId')

    req.io.to(receiverId).emit('message', populatedMessage)

    res.status(201).json(populatedMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getMessages = async (req, res) => {
  const { userId } = req.params
  const loggedInUserId = req.user

  const messages = await Message.find({
    $or: [
      { senderId: loggedInUserId, receiverId: userId },
      { senderId: userId, receiverId: loggedInUserId },
    ],
  })
    .populate('senderId')
    .populate('receiverId')

  res.status(200).json(messages)
}
