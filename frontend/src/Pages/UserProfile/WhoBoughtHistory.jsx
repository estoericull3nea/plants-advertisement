import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const WhoBoughtHistory = ({ isVisitor }) => {
  if (isVisitor) {
    return <div>You can't view this Payment History</div>
  }
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userId } = useParams()

  useEffect(() => {
    if (!isVisitor) {
      // Fetch payment history for the user
      fetchPaymentHistory()
    }
  }, [userId, isVisitor])

  const fetchPaymentHistory = async () => {
    setLoading(true)

    const token = localStorage.getItem('token')
    const userId = jwtDecode(token).id

    try {
      // Fetch payment links for the user
      const paymentLinksResponse = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/payments/payment-links/users/boughts-products/${userId}`,
        {
          params: { userId },
        }
      )

      const paymentLinks = paymentLinksResponse.data
      console.log(paymentLinks)

      setPaymentHistory(paymentLinks)
      toast.success('Payment history fetched successfully!')
    } catch (err) {
      setError('Failed to fetch payment history')
      toast.error('Failed to fetch payment history')
    } finally {
      setLoading(false)
    }
  }

  // Convert cents to PHP amount
  const convertCentsToPHP = (cents) => {
    return `₱${(cents / 100).toFixed(2)}` // Format as PHP currency
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-4 p-4'>
        <div className='skeleton h-32 w-full'></div>
        <div className='skeleton h-4 w-28'></div>
        <div className='skeleton h-4 w-full'></div>
        <div className='skeleton h-4 w-full'></div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      <h2 className='text-2xl font-bold mb-4'>
        Users Who Bought Your Products
      </h2>
      {paymentHistory.length === 0 ? (
        <p>No one bought your products.</p>
      ) : (
        <table className='table w-full table-zebra'>
          <thead>
            <tr>
              <th>Amount (PHP)</th>
              <th>Buyer Full Name</th>
              <th>Buyer Email</th>
              <th>Description</th>
              <th>Payment Source</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment._id}>
                {/* Convert amount from cents to PHP */}
                <td>{convertCentsToPHP(payment.amount)}</td>
                <td>
                  {payment.userId.firstName} {payment.userId.lastName}
                </td>
                <td>{payment.userId.email}</td>
                <td>{payment.description}</td>

                {/* <td>
                  <a
                    href={payment.payment_url}
                    className='text-blue-500 hover:underline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View
                  </a>
                </td> */}
                <td>
                  {payment.paymentDetails?.source?.type || 'GCASH'}
                  {/* Display the payment source type, e.g., 'gcash' */}
                </td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default WhoBoughtHistory
