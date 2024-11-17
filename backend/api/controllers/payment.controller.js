import {
  createPaymentLink,
  getAllPaymentLinks,
} from '../services/payment.service.js'

export const createPaymentLinkController = async (req, res) => {
  const { amount, description, remarks } = req.body
  const userId = req.user

  if (!amount || !description || !remarks) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const linkData = await createPaymentLink(amount, description, remarks, userId)
  res.status(200).json(linkData) // Return the created payment link data
}

export const getAllPaymentLinksController = async (req, res) => {
  const paymentLinks = await getAllPaymentLinks()
  res.status(200).json(paymentLinks)
}

export const getPaymentLinkByIdController = async (req, res) => {
  const { paymentLinkId } = req.params

  const paymentLink = await getPaymentLinkById(paymentLinkId)
  if (!paymentLink) {
    return res.status(404).json({ error: 'Payment link not found' })
  }
  res.status(200).json(paymentLink)
}
