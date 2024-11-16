import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { FaRegTrashAlt } from 'react-icons/fa'

const socket = io('http://localhost:5000')

const Cart = ({ isVisitor }) => {
  if (isVisitor) {
    return <div>You can't view this Cart</div>
  }

  const { userId } = useParams()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [editableItemId, setEditableItemId] = useState(null)
  const [viewingDetails, setViewingDetails] = useState(null)

  useEffect(() => {
    fetchCartItems()
  }, [userId])

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
      console.log(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

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

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected for deletion')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/delete/selected`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            cartIds: Array.from(selectedItems),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete selected items')
      }

      toast.success('Selected items removed from cart!')
      await fetchCartItems()
      setSelectedItems(new Set())
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

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }
      return newSelected
    })
  }

  const toggleDetails = (itemId) => {
    setViewingDetails((prev) => (prev === itemId ? null : itemId))
  }

  if (loading) {
    return (
      <div className='container mx-auto mt-4 px-4'>
        <h1 className='text-2xl font-bold mb-4'>Your Cart</h1>
        <div className='grid grid-cols-1 gap-2'>
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className='skeleton h-8 w-full rounded-lg mb-4'
            ></div>
          ))}
        </div>
        <div className='flex justify-between gap-2'>
          <div>
            <div className='skeleton h-8 w-[100px] rounded-lg mb-4'></div>
            <div className='skeleton h-8 w-[100px] rounded-lg mb-4'></div>
          </div>
          <div className='skeleton h-8 w-[100px] rounded-lg mb-4'></div>
        </div>
      </div>
    )
  }

  const groupByUser = (cartItems) => {
    return cartItems.reduce((acc, item) => {
      const userId = item.productId.userId
      if (!acc[userId]) {
        acc[userId] = {
          user: item.userId,
          products: [],
        }
      }
      acc[userId].products.push(item)

      return acc
    }, {})
  }

  return (
    <div className='container mx-auto px-4 bg-white p-5 border rounded-xl shadow-lg'>
      <h1 className='text-2xl font-bold mb-4'>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className='text-gray-600'>Your cart is empty.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 hidden md:table'>
            <thead>
              <tr>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  <input
                    type='checkbox'
                    onChange={(e) => {
                      setSelectedItems(
                        e.target.checked
                          ? new Set(cartItems.map((item) => item._id))
                          : new Set()
                      )
                    }}
                    checked={selectedItems.size === cartItems.length}
                  />
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Product
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Quantity
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {Object.values(groupByUser(cartItems)).map((group, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan='7' className='font-bold bg-gray-200 py-2 px-4'>
                      Posted by: {group.user.firstName} {group.user.lastName} (
                      {group.user.email})
                    </td>
                  </tr>
                  {group.products.map((item) => (
                    <tr key={item._id}>
                      <td className='px-2 py-2'>
                        <input
                          type='checkbox'
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleSelectItem(item._id)}
                        />
                      </td>
                      <td className='flex items-center px-2 py-2'>
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
                        <span>
                          {item.productId.title || 'Untitled Product'}
                        </span>
                      </td>
                      <td className='font-bold px-2 py-2'>
                        ₱{' '}
                        {item.productId.price
                          ? item.productId.price.toLocaleString()
                          : 'N/A'}
                      </td>
                      <td className='px-2 py-2'>
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
                      <td className='font-bold px-2 py-2'>
                        {item.productId.stock ? item.productId.stock : 'N/A'}
                      </td>
                      <td className='font-bold px-2 py-2'>
                        ₱ {item.total.toLocaleString()}
                      </td>
                      <td className='px-2 py-2'>
                        <div className='tooltip' data-tip='Remove'>
                          <button
                            className='p-2 rounded-lg border-main bg-red-500 text-white shadow-lg'
                            onClick={() => openConfirmModal(item._id)}
                            disabled={updating || deleting}
                          >
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className='md:hidden'>
            {cartItems.map((item) => (
              <div key={item._id} className='border-b py-4'>
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
                  <div className='flex-grow'>
                    <h2 className='text-lg'>
                      {item.productId.title || 'Untitled Product'}
                    </h2>
                    <p>
                      Price: ₱{' '}
                      {item.productId.price
                        ? item.productId.price.toLocaleString()
                        : 'N/A'}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <button
                    className='btn btn-accent'
                    onClick={() => toggleDetails(item._id)}
                  >
                    {viewingDetails === item._id ? 'Hide Details' : 'View'}
                  </button>
                </div>
                {viewingDetails === item._id && (
                  <div className='mt-2'>
                    <p>
                      Stock:{' '}
                      {item.productId.stock ? item.productId.stock : 'N/A'}
                    </p>
                    <p>Total: ₱ {item.total.toLocaleString()}</p>
                    <button
                      className='btn bg-red-600 text-white'
                      onClick={() => openConfirmModal(item._id)}
                      disabled={updating || deleting}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className='mt-6 flex flex-col sm:flex-row justify-between'>
          <div className='flex space-x-2'>
            <button
              className='py-1 font-semibold px-3 rounded-lg border-main bg-main text-white shadow-lg'
              onClick={deleteSelectedItems}
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Remove Selected'}
            </button>
          </div>
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
