// routes/likeRoutes.js
import express from 'express'
import {
  checkIfLiked,
  getLikesForProduct,
  getLikesForUser,
  likeProduct,
} from '../controllers/like.controller.js'

const router = express.Router()

router.post('/', likeProduct)
router.get('/product/:productId', getLikesForProduct)
router.get('/user/:userId', getLikesForUser)
router.get('/user/:userId/product/:productId', checkIfLiked)

export default router
