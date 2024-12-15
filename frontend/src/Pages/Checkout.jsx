import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FaRegCreditCard } from 'react-icons/fa'

const convertToCents = (amount) => Math.round(amount * 100)

const Checkout = () => {
  const location = useLocation()
  const { items } = location.state || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentLinkId, setPaymentLinkId] = useState(null)

  if (!items || items.length === 0) {
    return <p className='text-center'>No items selected for checkout.</p>
  }

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

  const handlePlaceOrder = async () => {
    if (totalAmount < 100) {
      toast.error('Please at least 100 pesos as required by Paymongo')
      return
    }

    setIsPlacingOrder(true)

    const amountInCents = convertToCents(totalAmount)

    const description =
      items
        .map((item) => item.productId.title)
        .join(', ')
        .slice(0, 200) || 'Order from E-commerce site'

    // const description = 'Order from E-commerce site'
    const remarks = 'Payment for selected items'

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/payments/create-payment-link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            amount: amountInCents,
            description,
            remarks,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        const checkoutUrl = data.payment_url
        setPaymentLinkId(data.paymongo_id) // Save the payment link ID for polling
        window.location.href = checkoutUrl // Redirect to payment page
      } else {
        toast.error(data.error || 'Failed to create payment link')
      }

      setIsModalOpen(false)
    } catch (error) {
      toast.error(
        'An error occurred while placing your order. Please try again.'
      )
      setIsModalOpen(false)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Polling for the payment status
  useEffect(() => {
    if (paymentLinkId) {
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_DEV_BACKEND_URL
            }/payments/payment-links/${paymentLinkId}`
          )
          const data = await response.json()

          if (data.status === 'successful' || data.status === 'failed') {
            setPaymentStatus(data.status)
            clearInterval(intervalId) // Stop polling once the status is determined
          }
        } catch (error) {
          console.error('Error fetching payment status:', error)
        }
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(intervalId) // Clean up the polling interval
    }
  }, [paymentLinkId])

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-2xl font-bold mb-4'>Checkout</h1>

      <div className='bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-xl font-semibold'>Your Order</h2>
        <div className='space-y-4 mt-4'>
          {items.map((item) => (
            <div key={item._id} className='flex justify-between items-center'>
              <div className='flex items-center'>
                <img
                  src={`${
                    item.productId.images && item.productId.images.length > 0
                      ? item.productId.images[0]
                      : 'placeholder-image-url.jpg'
                  }`}
                  alt={item.productId.title || 'Product Image'}
                  className='h-16 w-16 object-cover rounded-lg mr-4'
                />
                <div>
                  <h3 className='font-medium text-lg'>
                    {item.productId.title}
                  </h3>
                  <p>Price: ₱ {item.productId.price.toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className='font-bold'>₱ {item.total.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className='mt-6 flex justify-between items-center'>
          <p className='font-bold'>Total Amount:</p>
          <p className='text-xl font-semibold'>
            ₱ {totalAmount.toLocaleString()}
          </p>
        </div>

        <div className='mt-6'>
          <h3 className='font-semibold'>Payment Method</h3>
          <div className='flex justify-between items-center mt-3'>
            <div className='flex items-center'>
              <FaRegCreditCard className='mr-2' />
              <span>Credit/Debit Card/Gcash</span>
            </div>
            <button
              className='btn btn-primary'
              onClick={() => setIsModalOpen(true)}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='modal modal-open'>
          <div className='modal-box'>
            <h2 className='text-lg font-semibold'>Confirm Your Order</h2>
            <p>
              Are you sure you want to place the order for the selected items?
            </p>

            <div className='modal-action'>
              <button
                className='btn btn-secondary'
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Payment Status */}
      {paymentStatus && (
        <div className='mt-4'>
          {paymentStatus === 'successful' ? (
            <p className='text-green-500'>Payment was successful! Thank you.</p>
          ) : paymentStatus === 'failed' ? (
            <p className='text-red-500'>Payment failed. Please try again.</p>
          ) : (
            <p>Checking payment status...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Checkout
