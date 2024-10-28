// routes/products.js
import express from 'express'
import {
  createProduct,
  getAllProducts,
} from '../controllers/product.controller.js'

import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createProduct)
router.get('/', getAllProducts)

export default router
