import {
  createPaymentIntent,
  confirmPayment,
} from '../services/payment.service.js'
import mongoose from 'mongoose'

export const createPayment = async (req, res) => {
  let { userId, paymentMethodId } = req.body

  console.log(req.body)

  if (!userId || !paymentMethodId) {
    return res.status(400).json({
      success: false,
      message: 'userId and paymentMethodId are required',
    })
  }

  if (typeof userId === 'number') {
    userId = mongoose.Types.ObjectId(userId.toString())
  }

  try {
    const paymentIntent = await createPaymentIntent(userId)

    const paymentConfirmation = await confirmPayment(
      paymentIntent.id,
      paymentMethodId
    )

    if (paymentConfirmation.status === 'succeeded') {
      return res.status(200).json({
        success: true,
        message: 'Payment successfully confirmed',
        paymentConfirmation,
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment confirmation failed',
        paymentConfirmation,
      })
    }
  } catch (error) {
    console.error('Error during payment process:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating or confirming payment intent',
      error: error.message,
    })
  }
}
