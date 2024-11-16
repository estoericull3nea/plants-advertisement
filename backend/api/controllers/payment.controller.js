import { createPaymentIntent } from '../services/payment.service.js'
import { getTotalCart } from '../controllers/cart.controller.js' // Assuming getTotalCart is in the cart controller
import mongoose from 'mongoose' // Import mongoose to work with ObjectId

// Controller to create a payment intent using the user's cart total
export const createPayment = async (req, res) => {
  let { userId } = req.params // Get userId from params (or req.body if using body)

  // If the userId is a number, cast it to an ObjectId
  if (typeof userId === 'number') {
    userId = mongoose.Types.ObjectId(userId.toString()) // Convert number to ObjectId
  }

  try {
    // Get the total cart amount for the user

    // // If the total cart amount is less than a certain value (e.g., 2000), reject it
    // if (totalAmount < 2000) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Total amount must be at least 20 PHP' })
    // }

    // Create a payment intent using the cart total amount (in cents)
    const paymentIntent = await createPaymentIntent(userId)

    res.status(200).json({
      success: true,
      paymentIntent: paymentIntent,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message,
    })
  }
}
