import Message from '../models/chat.model.js'
import User from '../models/user.model.js'

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body
  const senderId = req.user

  const images =
    req.files && req.files.length > 0
      ? req.files.map((file) => file.path)
      : null

  const message = new Message({
    senderId,
    receiverId,
    text,
    images,
  })

  await message.save()

  const populatedMessage = await Message.findById(message._id)
    .populate('senderId')
    .populate('receiverId')

  req.io.to(receiverId).emit('message', populatedMessage)

  res.status(201).json(populatedMessage)
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
