import express from 'express'
import {
  checkStatusOfPaymentById,
  createPaymentLinkController,
  getAllPaymentLinksController,
  getAllPaymentsController,
  getAllUsersWhoBoughtYourProducts,
  getPaymentLinkByIdController,
  paymentWebhook,
} from '../controllers/payment.controller.js'

const router = express.Router()
import verifyToken from '../middlewares/verifyToken.js'

router.post('/create-payment-link', verifyToken, createPaymentLinkController)
router.get('/payment-links/users/:userId', getAllPaymentLinksController)
router.get('/payment-links/:paymentLinkId', getPaymentLinkByIdController)

router.post('/payment-webhook', paymentWebhook)
router.get(
  '/payment-links/:paymentLinkId/status',
  verifyToken,
  checkStatusOfPaymentById
)
router.get('/', verifyToken, getAllPaymentsController)

router.get(
  '/payment-links/users/boughts-products/:userId',
  getAllUsersWhoBoughtYourProducts
)

export default router
