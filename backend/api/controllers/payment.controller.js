import {
  createPaymentIntent,
  confirmPayment,
} from '../services/payment.service.js'
import mongoose from 'mongoose'

// Controller to create and confirm payment intent using the user's cart total
export const createPayment = async (req, res) => {
  let { userId, paymentMethodId } = req.body // Expecting userId and paymentMethodId in the body

  console.log(req.body)

  // Validate inputs
  if (!userId || !paymentMethodId) {
    return res.status(400).json({
      success: false,
      message: 'userId and paymentMethodId are required',
    })
  }

  // If the userId is a number, cast it to an ObjectId
  if (typeof userId === 'number') {
    userId = mongoose.Types.ObjectId(userId.toString()) // Convert number to ObjectId
  }

  try {
    // Step 1: Create the payment intent using the total amount from the cart
    const paymentIntent = await createPaymentIntent(userId)

    // Step 2: Confirm the payment using the paymentMethodId provided
    const paymentConfirmation = await confirmPayment(
      paymentIntent.id,
      paymentMethodId
    )

    // Check the status of the payment
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
