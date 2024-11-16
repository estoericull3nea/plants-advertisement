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

export const createPaymentIntent = async (
  userId,
  paymentMethods = ['gcash', 'card']
) => {
  try {
    const totalAmount = await getTotalCart(userId)

    const response = await axiosInstance.post('/payment_intents', {
      data: {
        attributes: {
          amount: totalAmount,
          currency: 'PHP',
          payment_method_allowed: paymentMethods,
          payment_method_types: paymentMethods,
        },
      },
    })

    return response.data.data
  } catch (error) {
    console.error(
      'Error creating payment intent:',
      error.response?.data || error.message
    )
    throw new Error('Failed to create payment intent')
  }
}

export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await axiosInstance.post(
      `/payment_intents/${paymentIntentId}/confirm`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId, // The payment method ID (e.g., GCash or card)
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
