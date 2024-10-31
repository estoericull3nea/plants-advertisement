import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { toast } from 'react-hot-toast'

const socket = io('http://localhost:5000')

const Cart = () => {
  const { userId } = useParams()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [error, setError] = useState(null)
  const [editableItemId, setEditableItemId] = useState(null)

  const fetchCartItems = async () => {
    setLoading(true)
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
      toast.error(err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [userId])

  const updateQuantity = async (itemId, newQuantity) => {
    setUpdating(true)
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/carts/${userId}/update-quantity`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: itemId,
            quantity: newQuantity,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      toast.success('Quantity updated successfully!')
      await fetchCartItems()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
      setEditableItemId(null)
    }
  }

  const deleteCartItem = async (itemId) => {
    setDeleting(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/${itemId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete cart item')
      }

      toast.success('Item removed from cart!')
      await fetchCartItems()
      setConfirmDeleteId(null)
      socket.emit('updateCartCount', 'cartCount')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const openConfirmModal = (itemId) => {
    setConfirmDeleteId(itemId)
  }

  const closeConfirmModal = () => {
    setConfirmDeleteId(null)
  }

  const handleEditClick = (itemId) => {
    setEditableItemId(itemId)
  }

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value) || 1
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleKeyPress = (e, itemId) => {
    if (e.key === 'Enter') {
      const newQuantity = parseInt(e.target.value) || 1
      if (newQuantity >= 1) {
        updateQuantity(itemId, newQuantity)
      }
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center'>
        <div className='skeleton h-32 w-full rounded-lg'></div>
      </div>
    )
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
                <th>Price</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className='flex items-center'>
                    <img
                      src={`http://localhost:5000/${
                        item.productId.images &&
                        item.productId.images.length > 0
                          ? item.productId.images[0]
                          : 'placeholder-image-url.jpg'
                      }`}
                      alt={item.productId.title || 'Product Image'}
                      className='h-20 w-20 object-cover rounded-lg mr-4'
                    />
                    {item.productId.title || 'Untitled Product'}
                  </td>
                  <td className='font-bold'>
                    ₱{' '}
                    {item.productId.price
                      ? item.productId.price.toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    {editableItemId === item._id ? (
                      <input
                        type='number'
                        min='1'
                        defaultValue={item.quantity}
                        onKeyPress={(e) =>
                          handleKeyPress(e, item.productId._id)
                        }
                        onBlur={() => setEditableItemId(null)}
                        className='input input-bordered w-20'
                        disabled={updating || deleting}
                      />
                    ) : (
                      <div className='flex items-center'>
                        <span className='mr-2'>{item.quantity}</span>
                        <button
                          className='btn btn-outline btn-sm'
                          onClick={() => handleEditClick(item._id)}
                          disabled={updating || deleting}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className='font-bold'>
                    {item.productId.stock ? item.productId.stock : 'N/A'}
                  </td>
                  <td className='font-bold'>₱ {item.total.toLocaleString()}</td>
                  <td>
                    <button
                      className='btn bg-red-600 text-white'
                      onClick={() => openConfirmModal(item._id)}
                      disabled={updating || deleting}
                    >
                      Remove
                    </button>
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

      {confirmDeleteId && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-lg font-bold'>Confirm Deletion</h2>
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className='mt-4 flex justify-end'>
              <button
                className='btn btn-secondary mr-2'
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                className='btn btn-danger'
                onClick={() => {
                  deleteCartItem(confirmDeleteId)
                  closeConfirmModal()
                }}
                disabled={deleting}
              >
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
