import axios from 'axios'
import dotenv from 'dotenv'

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

// 1. Create Payment Intent
// 1. Create Payment Intent
export const createPaymentIntent = async (
  amount,
  currency = 'PHP',
  paymentMethods = ['gcash', 'card']
) => {
  // Ensure the amount is at least 2000 cents (PHP 20.00)
  if (amount < 2000) {
    throw new Error('Amount must be at least 2000 cents (PHP 20.00)')
  }

  try {
    const response = await axiosInstance.post('/payment_intents', {
      data: {
        attributes: {
          amount: amount,
          currency: currency,
          payment_method_allowed: paymentMethods, // Specify allowed payment methods
          payment_method_types: paymentMethods, // This could be 'gcash', 'card', or both
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
