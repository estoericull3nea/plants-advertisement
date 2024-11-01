// routes/likeRoutes.js
import express from 'express'
import {
  getLikesForProduct,
  getLikesForUser,
  likeProduct,
} from '../controllers/like.controller.js'

const router = express.Router()

router.post('/', likeProduct)
router.get('/product/:productId', getLikesForProduct)
router.get('/user/:userId', getLikesForUser)

export default router
