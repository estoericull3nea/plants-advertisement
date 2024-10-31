import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${id}`
      )
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      const userId = localStorage.getItem('userId')
      await axios.post(`${import.meta.env.VITE_DEV_BACKEND_URL}/carts/add`, {
        productId: product._id,
        userId,
        quantity,
      })
      toast.success('Added to cart')

      setProduct((prevProduct) => ({
        ...prevProduct,
        stock: prevProduct.stock - quantity,
      }))

      setQuantity(1)

      socket.emit('updateCartCount', 'cartCount')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex flex-col md:flex-row'>
          <div className='skeleton h-96 w-full md:w-1/2 mr-4'></div>
          <div className='w-full md:w-1/2'>
            <div className='skeleton h-8 w-full mb-4'></div>
            <div className='skeleton h-4 w-full mb-2'></div>
            <div className='skeleton h-4 w-1/2 mb-2'></div>
            <div className='skeleton h-4 w-1/2 mb-2'></div>
            <div className='skeleton h-4 w-full mb-2'></div>
            <div className='skeleton h-4 w-full mb-2'></div>
            <div className='skeleton h-4 w-full mb-2'></div>
            <div className='skeleton h-4 w-full mb-2'></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const totalPrice = product.price * quantity

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 pr-4 mb-4 md:mb-0'>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            className='h-full'
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`http://localhost:5000/${image}`}
                  className='rounded-box w-full h-full object-fit'
                  alt={`Product Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='w-full md:w-1/2 border p-3 shadow-lg rounded-lg text-sm'>
          <h1 className='text-xl font-bold mb-4'>{product.title}</h1>
          <p className='text-lg mb-2'>{product.caption}</p>
          <p className='font-bold text-xl mb-2'>
            ₱ {product.price.toLocaleString()}
          </p>
          <p
            className={`mt-2 ${
              product.stock === 0 ? 'text-red-500 font-bold' : ''
            }`}
          >
            Stock: {product.stock}
          </p>
          <p className='mt-2'>Category: {product.category}</p>
          <p className='mt-2'>Address: {product.address}</p>

          <div className='mt-4 flex flex-col sm:flex-row'>
            <input
              type='number'
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(e.target.value, product.stock))
              }
              className='border rounded p-2 mr-2 mb-2 sm:mb-0 sm:mr-2 flex-1'
              min='1'
              max={product.stock}
            />
            <button
              onClick={handleAddToCart}
              className='bg-main text-white rounded px-4 py-2'
              disabled={addingToCart || product.stock === 0}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          <p className='font-bold mt-4'>
            Total Price: ₱ {totalPrice.toLocaleString()}
          </p>

          <h2 className='text-2xl font-bold mt-8'>User Information</h2>
          <div className='mt-4'>
            <table className='min-w-full border-collapse'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='border px-4 py-2 text-left'>Field</th>
                  <th className='border px-4 py-2 text-left'>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Name:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.firstName || 'N/A'}{' '}
                    {product.userId.lastName || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Email:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    <a
                      href={`mailto:${product.userId.email}`}
                      className='text-blue-600 underline'
                    >
                      {product.userId.email || 'N/A'}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Contact Number:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.contactNumber || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Municipality:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.municipality || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Barangay:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.barangay || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Age:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.age === 0 ? product.userId.age : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>
                    <strong>Date of Birth:</strong>
                  </td>
                  <td className='border px-4 py-2'>
                    {product.userId.dateOfBirth
                      ? new Date(
                          product.userId.dateOfBirth
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
