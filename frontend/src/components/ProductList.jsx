import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const ProductList = ({ trigger }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/products`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setProducts(response.data)
        applyFilter(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [trigger])

  const applyFilter = (products) => {
    const token = localStorage.getItem('token')
    let userIdToExclude = null

    if (token) {
      const decodedToken = jwtDecode(token)
      userIdToExclude = decodedToken.id
    }

    const filtered = products.filter(
      (product) => product.userId._id !== userIdToExclude
    )
    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (event) => {
    const category = event.target.value
    setSelectedCategory(category)

    const token = localStorage.getItem('token')
    let userIdToExclude = null

    if (token) {
      const decodedToken = jwtDecode(token)
      userIdToExclude = decodedToken.id
    }

    if (category === 'all') {
      applyFilter(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.category === category &&
          product.userId._id !== userIdToExclude
      )
      setFilteredProducts(filtered)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Marketplace</h1>

      <div className='mb-4'>
        <label htmlFor='category' className='block text-sm font-medium mb-2'>
          Filter by Category:
        </label>
        <select
          id='category'
          value={selectedCategory}
          onChange={handleCategoryChange}
          className='select select-bordered w-full max-w-xs'
        >
          <option value='all'>All Categories</option>
          <option value='crops'>Crops</option>
          <option value='fisheries'>Fisheries</option>
          <option value='livestock'>Livestock</option>
        </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className='flex flex-col gap-4'>
              <div className='skeleton h-32 w-full'></div>
              <div className='skeleton h-4 w-28'></div>
              <div className='skeleton h-4 w-full'></div>
              <div className='skeleton h-4 w-full'></div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className='col-span-full text-center p-4 text-lg text-gray-700'>
            No posts about this category
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className='border rounded-lg overflow-hidden shadow-lg'
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.title}
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  {/* <h2 className='text-lg font-semibold'>{product.title}</h2>
                  <p className='text-gray-700'>{product.caption}</p> */}
                  <p className='font-bold'>{product.category.toUpperCase()}</p>
                  <p className='font-bold'>₱ {product.price}</p>
                  <p className='text-gray-500'>
                    Posted by: {product.userId.firstName}{' '}
                    {product.userId.lastName}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductList
