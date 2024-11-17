import axios from 'axios'
import PaymentLink from '../models/paymentLink.model.js'

export const createPaymentLink = async (
  amount,
  description,
  remarks,
  userId
) => {
  const options = {
    method: 'POST',
    url: 'https://api.paymongo.com/v1/links',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Basic c2tfdGVzdF9tNkF4UnlRV2NQa2d6cmM1Y3RGVDR6UXA6',
    },
    data: {
      data: {
        attributes: {
          amount,
          description,
          remarks,
        },
      },
    },
  }

  const response = await axios.request(options)

  const paymentLink = new PaymentLink({
    amount,
    description,
    remarks,
    paymongo_id: response.data.data.id,
    status: response.data.data.attributes.status,
    payment_url: response.data.data.attributes.checkout_url,
    userId,
  })

  await paymentLink.save()

  return paymentLink
}

export const getAllPaymentLinks = async () => {
  const paymentLinks = await PaymentLink.find().populate('userId', 'name email')
  return paymentLinks
}

export const getPaymentLinkById = async (paymentLinkId) => {
  const paymentLink = await PaymentLink.findById(paymentLinkId).populate(
    'userId',
    'name email'
  )
  return paymentLink
}
