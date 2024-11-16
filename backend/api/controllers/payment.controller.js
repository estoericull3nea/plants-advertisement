import {
  createPaymentIntent,
  confirmPayment,
} from '../services/payment.service.js' // Import confirmPayment from service
import mongoose from 'mongoose'

export const createPayment = async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId is required',
    })
  }

  try {
    // 1. Create the payment intent
    const paymentIntent = await createPaymentIntent(userId)

    res.status(200).json({
      success: true,
      paymentIntent, // Send back the payment intent object
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent',
    })
  }
}

// Note: Don't export confirmPayment here; it should be imported from the service file.
