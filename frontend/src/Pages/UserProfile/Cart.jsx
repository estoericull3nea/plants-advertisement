import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Cart = () => {
  const { userId } = useParams()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/${userId}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch cart items')
        }
        const data = await response.json()
        setCartItems(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [userId])

  if (loading) {
    return (
      <div className='flex justify-center'>
        <div className='skeleton h-32 w-full rounded-lg'></div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='container mx-auto mt-4 px-4'>
      <h1 className='text-2xl font-bold mb-4'>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className='text-gray-600'>Your cart is empty.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table w-full'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className='flex items-center'>
                    <img
                      src={`http://localhost:5000/${item.productId.images[0]}`} // Your image endpoint
                      alt={item.productId.title}
                      className='h-20 w-20 object-cover rounded-lg mr-4'
                    />
                    {item.productId.title}
                  </td>
                  <td>{item.quantity}</td>
                  <td className='font-bold'>₱ {item.total.toLocaleString()}</td>
                  <td>
                    <button className='btn btn-primary'>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className='mt-6 flex flex-col sm:flex-row justify-between'>
          <button className='btn btn-accent w-full sm:w-auto'>Checkout</button>
          <p className='font-semibold mt-2 sm:mt-0'>
            Total: ₱{' '}
            {cartItems
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default Cart
