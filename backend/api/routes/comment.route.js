import express from 'express'
import {
  createComment,
  getCommentsByProduct,
} from '../controllers/comment.controller.js'

const router = express.Router()

router.post('/', createComment)
router.get('/:productId', getCommentsByProduct)

export default router
