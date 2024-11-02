import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom' // Import Link

const RelatedProducts = ({ category, productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/products/related/${category}/${productId}`
      )
      setRelatedProducts(response.data)
    } catch (err) {
      setError('Error fetching related products')
      toast.error('Error fetching related products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category) {
      fetchRelatedProducts()
    }
  }, [category])

  if (loading) {
    return (
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Related Products</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className='flex flex-col gap-4 border rounded p-4 shadow'
            >
              <div className='skeleton h-32 w-full'></div>
              <div className='skeleton h-4 w-28'></div>
              <div className='skeleton h-4 w-full'></div>
              <div className='skeleton h-4 w-full'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>Related Products</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {relatedProducts.map((product) => (
          <Link
            to={`/products/${product._id}`}
            key={product._id}
            className='border rounded p-4 shadow hover:bg-gray-100 transition'
          >
            <img
              src={`http://localhost:5000/${product.images[0]}`}
              alt={product.title}
              className='w-full h-32 object-cover mb-2 rounded'
            />
            <h3 className='font-bold'>{product.title}</h3>
            <p>₱ {product.price.toLocaleString()}</p>
            <p>Category: {product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
