import express from 'express'
import {
  createPaymentLinkController,
  getAllPaymentLinksController,
  getPaymentLinkByIdController,
} from '../controllers/payment.controller.js'

const router = express.Router()
import verifyToken from '../middlewares/verifyToken.js'

router.post('/create-payment-link', verifyToken, createPaymentLinkController)
router.get('/payment-links', getAllPaymentLinksController)
router.get('/payment-links/:paymentLinkId', getPaymentLinkByIdController)

export default router
