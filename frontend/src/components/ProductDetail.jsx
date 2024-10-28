import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1) // State for quantity

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${id}`
        )
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/add`,
        { productId: product._id, userId, quantity }
      )
      toast.success('Added to cart') // Alert the user
      setQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding to cart')
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{product.title}</h1>
      <div className='flex'>
        <img
          src={`http://localhost:5000/${product.images[0]}`} // Assuming images[0] is the main image
          alt={product.title}
          className='w-1/2 h-96 object-cover mr-4' // Adjust width and margin as needed
        />
        <div className='w-1/2'>
          <p className='text-lg mb-2'>{product.caption}</p>
          <p className='font-bold text-xl mb-2'>${product.price}</p>
          <p className='mt-2'>Stock: {product.stock}</p>
          <p className='mt-2'>Category: {product.category}</p>
          <p className='mt-2'>Address: {product.address}</p>

          {/* Quantity Input and Add to Cart Button */}
          <div className='mt-4'>
            <input
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='border rounded p-2 mr-2'
              min='1'
              max={product.stock} // Ensure quantity does not exceed stock
            />
            <button
              onClick={handleAddToCart}
              className='bg-blue-500 text-white rounded px-4 py-2'
            >
              Add to Cart
            </button>
          </div>

          <h2 className='text-2xl font-bold mt-8'>User Information</h2>
          <div className='mt-4'>
            <p>
              <strong>Name:</strong> {product.userId.firstName}{' '}
              {product.userId.lastName}
            </p>
            <p>
              <strong>Email:</strong> {product.userId.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {product.userId.contactNumber}
            </p>
            <p>
              <strong>Municipality:</strong> {product.userId.municipality}
            </p>
            <p>
              <strong>Barangay:</strong> {product.userId.barangay}
            </p>
            <p>
              <strong>Age:</strong> {product.userId.age}
            </p>
            <p>
              <strong>Date of Birth:</strong>{' '}
              {new Date(product.userId.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
