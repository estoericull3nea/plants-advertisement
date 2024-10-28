// routes/products.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product.controller.js'

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Folder to save uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    ) // Unique filename
  },
})

// Create the multer instance
const upload = multer({ storage })

import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, upload.array('images', 5), createProduct)
router.get('/', getAllProducts)

router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
