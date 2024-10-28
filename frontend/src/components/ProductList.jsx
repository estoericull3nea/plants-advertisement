import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/products`
        )
        setProducts(response.data)
        setFilteredProducts(response.data) // Set initial filtered products
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  const handleCategoryChange = (event) => {
    const category = event.target.value
    setSelectedCategory(category)

    if (category === 'all') {
      setFilteredProducts(products) // Show all products
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      )
      setFilteredProducts(filtered) // Filter products by selected category
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Marketplace</h1>

      {/* Category Filter */}
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
          <option value='uncategorized'>Uncategorized</option>
        </select>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className='border rounded-lg overflow-hidden shadow-lg'
          >
            <Link to={`/products/${product._id}`}>
              <img
                src={`http://localhost:5000/${product.images[0]}`} // Assuming images[0] is the main image
                alt={product.title}
                className='w-full h-48 object-cover'
              />
              <div className='p-4'>
                <h2 className='text-lg font-semibold'>{product.title}</h2>
                <p className='text-gray-700'>{product.caption}</p>
                <p className='font-bold'>₱ {product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
