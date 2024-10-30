import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem('userId')
      await axios.post(`${import.meta.env.VITE_DEV_BACKEND_URL}/carts/add`, {
        productId: product._id,
        userId,
        quantity,
      })
      toast.success('Added to cart')
      setQuantity(1)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex'>
          <div className='skeleton h-96 w-1/2 mr-4'></div>
          <div className='w-1/2'>
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

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>{product.title}</h1>
      <div className='flex'>
        <div className='w-1/2 pr-4'>
          {product.images.length > 1 ? (
            <Swiper spaceBetween={50} slidesPerView={1}>
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000/${image}`}
                    className='rounded-box w-full h-96 object-cover'
                    alt={`Product Image ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={`http://localhost:5000/${product.images[0]}`}
              className='rounded-box w-full h-96 object-cover'
              alt={product.title}
            />
          )}
        </div>

        <div className='w-1/2'>
          <p className='text-lg mb-2'>{product.caption}</p>
          <p className='font-bold text-xl mb-2'>${product.price}</p>
          <p className='mt-2'>Stock: {product.stock}</p>
          <p className='mt-2'>Category: {product.category}</p>
          <p className='mt-2'>Address: {product.address}</p>

          <div className='mt-4'>
            <input
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='border rounded p-2 mr-2'
              min='1'
              max={product.stock}
            />
            <button
              onClick={handleAddToCart}
              className='bg-main text-white rounded px-4 py-2'
            >
              Add to Cart
            </button>
          </div>

          <h2 className='text-2xl font-bold mt-8'>User Information</h2>
          <div className='mt-4'>
            <p>
              <strong>Name:</strong> {product.userId.firstName || 'N/A'}{' '}
              {product.userId.lastName || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {product.userId.email || 'N/A'}
            </p>
            <p>
              <strong>Contact Number:</strong>{' '}
              {product.userId.contactNumber || 'N/A'}
            </p>
            <p>
              <strong>Municipality:</strong>{' '}
              {product.userId.municipality || 'N/A'}
            </p>
            <p>
              <strong>Barangay:</strong> {product.userId.barangay || 'N/A'}
            </p>
            <p>
              <strong>Age:</strong>{' '}
              {product.userId.age === 0 ? product.userId.age : 'N/A'}
            </p>
            <p>
              <strong>Date of Birth:</strong>{' '}
              {product.userId.dateOfBirth
                ? new Date(product.userId.dateOfBirth).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
