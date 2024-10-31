import Message from '../models/chat.model.js'

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

  try {
    await message.save()
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error })
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
    .populate('senderId', 'username')
    .populate('receiverId', 'username')

  res.status(200).json(messages)
}
