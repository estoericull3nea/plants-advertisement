import express from 'express'
import {
  createPayment,
  confirmPaymentIntent,
} from '../controllers/payment.controller.js'

const router = express.Router()

// Route to create a payment intent
router.post('/create-payment-intent', createPayment)

// Route to confirm a payment intent
router.post('/confirm-payment', confirmPaymentIntent)

export default router
