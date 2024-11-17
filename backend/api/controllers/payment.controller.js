import { createPaymentLink } from '../services/payment.service.js'

export const createPaymentLinkController = async (req, res) => {
  const { amount, description, remarks } = req.body

  // Validate inputs
  if (!amount || !description || !remarks) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Call the model function to create the payment link
    const linkData = await createPaymentLink(amount, description, remarks)
    res.status(200).json(linkData) // Return the PayMongo response to the client
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to create payment link', details: err.message })
  }
}
