// routes/likeRoutes.js
import express from 'express'
import {
  checkIfLiked,
  countLikes,
  getLikesByProductId,
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
router.get('/product/:productId', getLikesByProductId)

export default router
