import axios from 'axios'
import dotenv from 'dotenv'
import { getTotalCart } from '../controllers/cart.controller.js'

dotenv.config()

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1'

const axiosInstance = axios.create({
  baseURL: PAYMONGO_API_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString(
      'base64'
    )}`,
    'Content-Type': 'application/json',
  },
})

// 1. Create Payment Intent using the cart total
export const createPaymentIntent = async (
  userId,
  paymentMethods = ['gcash', 'card']
) => {
  try {
    // Step 1: Calculate the total amount from the user's cart
    const totalAmount = await getTotalCart(userId)

    // Ensure the amount is at least 2000 cents (PHP 20.00)
    if (totalAmount < 2000) {
      throw new Error('Amount must be at least 2000 cents (PHP 20.00)')
    }

    // Step 2: Create the payment intent with the total amount from the cart
    const response = await axiosInstance.post('/payment_intents', {
      data: {
        attributes: {
          amount: totalAmount, // Total amount in cents (e.g., 2000 = PHP 20.00)
          currency: 'PHP',
          payment_method_allowed: paymentMethods, // Allowed payment methods (e.g., "gcash", "card")
          payment_method_types: paymentMethods, // Payment method types (e.g., "gcash", "card")
        },
      },
    })

    return response.data.data // Payment intent object
  } catch (error) {
    console.error(
      'Error creating payment intent:',
      error.response?.data || error.message
    )
    throw new Error('Failed to create payment intent')
  }
}

// 2. Confirm Payment
export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await axiosInstance.post(
      `/payment_intents/${paymentIntentId}/confirm`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId,
          },
        },
      }
    )

    return response.data.data
  } catch (error) {
    console.error(
      'Error confirming payment:',
      error.response?.data || error.message
    )
    throw new Error('Failed to confirm payment')
  }
}
