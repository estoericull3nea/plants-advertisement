// routes/likeRoutes.js
import express from 'express'
import {
  checkIfLiked,
  countLikes,
  getLikesForProduct,
  getLikesForUser,
  toggleLikeProduct,
} from '../controllers/like.controller.js'

const router = express.Router()

router.post('/toggle', toggleLikeProduct)
router.get('/product/:productId', getLikesForProduct)
router.get('/user/:userId', getLikesForUser)
router.get('/user/:userId/product/:productId', checkIfLiked)
router.get('/count/product/:productId', countLikes)

export default router
