// routes/paymentRoutes.js
import express from 'express'
import { createPaymentLinkController } from '../controllers/payment.controller.js'

const router = express.Router()

router.post('/create-payment-link', createPaymentLinkController)

export default router
