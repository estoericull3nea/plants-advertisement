import express from 'express'
import {
  createComment,
  getCommentsByProductId,
} from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/', createComment)
router.get('/:productId', getCommentsByProductId)

export default router
