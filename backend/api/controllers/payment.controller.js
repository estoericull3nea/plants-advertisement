import {
  createPaymentLink,
  getAllPaymentLinks,
  getPaymentLinkById,
  updatePaymentStatus,
  getAllPayments,
} from '../services/payment.service.js'
import Product from '../models/product.model.js'
import Cart from '../models/cartItem.model.js'

import axios from 'axios'

export const createPaymentLinkController = async (req, res) => {
  const { amount, description, remarks, itemIds, itemQuantities } = req.body
  const userId = req.user

  if (!amount || !description || !remarks || !itemIds || !itemQuantities) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Check if itemIds and itemQuantities arrays are the same length
  if (itemIds.length !== itemQuantities.length) {
    return res.status(400).json({ error: 'Item IDs and quantities mismatch' })
  }

  try {
    // Loop through the items and update stock based on quantities
    for (let i = 0; i < itemIds.length; i++) {
      const productId = itemIds[i]
      const quantityToDeduct = itemQuantities[i]

      // Fetch the product by ID
      const product = await Product.findById(productId)
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${productId}` })
      }

      // Check if there's enough stock for the order
      if (product.stock < quantityToDeduct) {
        return res
          .status(400)
          .json({ message: `Not enough stock for product ${productId}` })
      }

      // Decrease the stock based on the quantity
      product.stock -= quantityToDeduct
      await product.save()

      // Remove the cart item for this product
      await Cart.findOneAndDelete({ userId, productId })
    }

    // Proceed to create the payment link
    const linkData = await createPaymentLink(
      amount,
      description,
      remarks,
      userId
    )

    return res.status(200).json(linkData) // Return the created payment link data
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'An error occurred while processing the payment link' })
  }
}

export const getAllPaymentLinksController = async (req, res) => {
  const { userId } = req.params

  try {
    const paymentLinks = await getAllPaymentLinks(userId)
    res.status(200).json(paymentLinks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch payment links' })
  }
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

  await updatePaymentStatus(id, status)
  res.status(200).send('Webhook processed successfully')
}

export const checkStatusOfPaymentById = async (req, res) => {
  const { paymentLinkId } = req.params

  // Validate the paymentLinkId
  if (!paymentLinkId) {
    return res.status(400).json({ error: 'Payment link ID is required' })
  }

  const options = {
    method: 'GET',
    url: `https://api.paymongo.com/v1/links/${paymentLinkId}`,
    headers: {
      accept: 'application/json',
      authorization: 'Basic c2tfdGVzdF9tNkF4UnlRV2NQa2d6cmM1Y3RGVDR6UXA6',
    },
  }

  const response = await axios.request(options)

  const paymentLink = response.data.data

  const paymentStatus = paymentLink.attributes.status
  return res.status(200).json(response.data.data)
}

export const getAllPaymentsController = async (req, res) => {
  try {
    const payments = await getAllPayments()
    res.status(200).json(payments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
}
