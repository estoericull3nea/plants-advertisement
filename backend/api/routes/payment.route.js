import express from 'express'
import { createPayment } from '../controllers/payment.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/create-payment-intent', verifyToken, createPayment)

export default router
