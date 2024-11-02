import Comment from '../models/comment.model.js'
import User from '../models/user.model.js'

export const createComment = async (req, res) => {
  const comment = new Comment(req.body)
  await comment.save()
  res.status(201).json(comment)
}

export const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params
  const comments = await Comment.find({ productId }).populate('userId')

  res.status(200).json(comments)
}
