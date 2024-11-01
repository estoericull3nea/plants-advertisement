// routes/likeRoutes.js
import express from 'express'
import { likeProduct } from '../controllers/like.controller'

const router = express.Router()

router.post('/', likeProduct)

export default router
