import Comment from '../models/comment.model.js'

export const createComment = async (req, res) => {
  const comment = new Comment(req.body)
  await comment.save()
  res.status(201).json(comment)
}

export const getCommentsByProductId = async (req, res) => {
  const comments = await Comment.find({ productId: req.params.productId })
  res.status(200).json(comments)
}
