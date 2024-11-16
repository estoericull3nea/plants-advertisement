import express from 'express'
import { createPayment } from '../controllers/payment.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

// Route to create a payment intent
router.post('/create-payment-intent/:userId', verifyToken, createPayment)

export default router
