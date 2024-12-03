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

// Get a message by ID
export const getMessageById = async (req, res) => {
  const { id } = req.params
  const message = await Message.findById(id).populate('senderId receiverId')
  if (!message) {
    return res.status(404).json({ error: 'Message not found' })
  }
  return res.status(200).json(message)
}

// Update a message
export const updateMessage = async (req, res) => {
  const { id } = req.params
  const updates = req.body
  const updatedMessage = await Message.findByIdAndUpdate(id, updates, {
    new: true,
  })
  if (!updatedMessage) {
    return res.status(404).json({ error: 'Message not found' })
  }
  return res.status(200).json(updatedMessage)
}

// Delete a message
export const deleteMessage = async (req, res) => {
  const { id } = req.params
  const deletedMessage = await Message.findByIdAndDelete(id)
  if (!deletedMessage) {
    return res.status(404).json({ error: 'Message not found' })
  }
  return res.status(200).json({ message: 'Message deleted successfully' })
}

export const getAllMessages = async (req, res) => {
  const messages = await Message.find()
    .populate('senderId')
    .populate('receiverId')
  return res.status(200).json(messages)
}

export const getUsersWithConversations = async (req, res) => {
  const loggedInUserId = req.user

  try {
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).select('senderId receiverId')

    const userIds = new Set()
    messages.forEach((message) => {
      userIds.add(message.senderId.toString())
      userIds.add(message.receiverId.toString())
    })

    userIds.delete(loggedInUserId.toString()) // Remove the logged-in user's ID

    const users = await User.find({ _id: { $in: Array.from(userIds) } })
      .select('firstName lastName email profilePictureUrl lastActive')
      .exec()

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users with conversations:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
