import express from 'express'
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from '../controllers/cart.controller.js'

const router = express.Router()

router.post('/add', addToCart)

router.get('/:userId', getCartItems)
router.put('/:id', updateCartItem)
router.delete('/:id', deleteCartItem)

export default router
