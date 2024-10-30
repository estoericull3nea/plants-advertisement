import express from 'express'
import {
  addToCart,
  deleteCartItem,
  getCartCount,
  getCartItems,
  updateCartItem,
} from '../controllers/cart.controller.js'

import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/add', addToCart)

router.get('/:userId', getCartItems)
router.put('/:id', updateCartItem)
router.delete('/:id', deleteCartItem)
router.get('/count/:userId', verifyToken, getCartCount)
router.put('/:userId/update-quantity', updateCartItem)

export default router
