import {
  createPaymentLink,
  getAllPaymentLinks,
  getPaymentLinkById,
  updatePaymentStatus,
} from '../services/payment.service.js'

export const createPaymentLinkController = async (req, res) => {
  const { amount, description, remarks } = req.body
  const userId = req.user

  if (!amount || !description || !remarks) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const linkData = await createPaymentLink(amount, description, remarks, userId)
  res.status(200).json(linkData) // Return the created payment link data
}

export const getAllPaymentLinksController = async (req, res) => {
  const paymentLinks = await getAllPaymentLinks()
  res.status(200).json(paymentLinks)
}

export const getPaymentLinkByIdController = async (req, res) => {
  const { paymentLinkId } = req.params

  const paymentLink = await getPaymentLinkById(paymentLinkId)
  if (!paymentLink) {
    return res.status(404).json({ error: 'Payment link not found' })
  }
  res.status(200).json(paymentLink)
}

const verifyPayMongoSignature = (payload, signature) => {
  const crypto = require('crypto')
  const PAYMONGO_SECRET_KEY = 'sk_test_m6AxRyQWcPkgzrc5ctFT4zQp' // Secret key, not public key

  const hmac = crypto.createHmac('sha256', PAYMONGO_SECRET_KEY)
  hmac.update(JSON.stringify(payload))
  const expectedSignature = hmac.digest('hex')

  return expectedSignature === signature
}

export const paymentWebhook = async (req, res) => {
  const payload = req.body
  const signature = req.headers['paymongo-signature']

  // Log payload and signature to verify what we are receiving
  console.log('Received payload:', payload)
  console.log('Received signature:', signature)

  const isValid = verifyPayMongoSignature(payload, signature)

  if (!isValid) {
    console.log('Invalid signature')
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const {
    data: { attributes },
  } = payload
  const { status, id } = attributes

  console.log('Payment status:', status, 'PayMongo ID:', id)

  try {
    // Try to update the payment status in the database
    await updatePaymentStatus(id, status)
    res.status(200).send('Webhook processed successfully')
  } catch (error) {
    console.log('Error updating payment status:', error)
    res.status(500).json({ error: 'Failed to update payment status' })
  }
}
