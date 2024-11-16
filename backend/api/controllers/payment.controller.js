import {
  createPaymentIntent,
  confirmPayment,
} from '../services/payment.service.js'

export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body // Amount in cents (e.g., 1000 = 10.00 PHP)

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const paymentIntent = await createPaymentIntent(amount)
    res.status(200).json({ paymentIntent })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating payment', error: error.message })
  }
}

export const confirmPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body

    if (!paymentIntentId || !paymentMethodId) {
      return res
        .status(400)
        .json({ message: 'Missing payment intent or payment method' })
    }

    const confirmation = await confirmPayment(paymentIntentId, paymentMethodId)
    res.status(200).json({ confirmation })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error confirming payment', error: error.message })
  }
}
