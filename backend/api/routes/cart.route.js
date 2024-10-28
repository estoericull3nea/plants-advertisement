import express from 'express'
import { addToCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.post('/add', addToCart)

export default router
