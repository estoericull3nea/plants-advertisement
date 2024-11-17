import { createPaymentLink } from '../services/payment.service.js'

export const createPaymentLinkController = async (req, res) => {
  const { amount, description, remarks } = req.body

  if (!amount || !description || !remarks) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const linkData = await createPaymentLink(amount, description, remarks)
  res.status(200).json(linkData)
}
