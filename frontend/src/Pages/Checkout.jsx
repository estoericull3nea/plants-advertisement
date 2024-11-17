import React from 'react'
import { useLocation } from 'react-router-dom' // To access passed state
import { toast } from 'react-hot-toast'
import { FaRegCreditCard } from 'react-icons/fa'

const Checkout = () => {
  const location = useLocation()
  const { items } = location.state || {} // Get selected items from state

  if (!items || items.length === 0) {
    return <p className='text-center'>No items selected for checkout.</p>
  }

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

  const handlePlaceOrder = () => {
    // Here you can integrate the payment gateway or any backend API
    toast.success('Order placed successfully!')
    // Redirect user to a confirmation page or home page after successful checkout
  }

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
                  src={`http://localhost:5000/${
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

        {/* Payment Method Section */}
        <div className='mt-6'>
          <h3 className='font-semibold'>Payment Method</h3>
          <div className='flex justify-between items-center mt-3'>
            <div className='flex items-center'>
              <FaRegCreditCard className='mr-2' />
              <span>Credit/Debit Card</span>
            </div>
            <button className='btn btn-primary' onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
