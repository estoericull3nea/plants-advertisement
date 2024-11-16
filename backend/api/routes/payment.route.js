import express from 'express'
import { createPayment } from '../controllers/payment.controller.js' // Only import createPayment from controller
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/create-payment-intent', verifyToken, createPayment) // This is correct
router.post('/confirm-payment', verifyToken, createPayment) // Use createPayment since it already handles confirm

export default router
