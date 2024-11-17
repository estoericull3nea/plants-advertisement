import axios from 'axios'

export const createPaymentLink = async (amount, description, remarks) => {
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

  try {
    const response = await axios.request(options)
    return response.data // Return the response data (payment link details)
  } catch (err) {
    console.error('Error creating payment link:', err)
    throw err // Propagate the error for handling in the controller
  }
}
