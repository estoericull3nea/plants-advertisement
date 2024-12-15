import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ProductList from '../components/ProductList'
import { jwtDecode } from 'jwt-decode'

const PostProduct = () => {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('crops')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')
  const [trigger, setTrigger] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [userStatus, setUserStatus] = useState(null) // Stores the user verification status
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [completeAddress, setCompleteAddress] = useState(false)
  const [packaging, setPackaging] = useState('per kilo')

  const [loading, setLoading] = useState(false)
  const [notFoundSearch, setNotFoundSearch] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')

      if (!token) return

      try {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.id

        // Fetch user data by userId
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`
        )

        const barangay = response.data.barangay
        const municipality = response.data.municipality
        const completeAddress = `${barangay}, ${municipality}, Pangasinan`
        setCompleteAddress(completeAddress)

        // Check if the user is verified
        if (response.data.isVerified !== true) {
          setUserStatus('not_verified')
        } else {
          setUserStatus('verified')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    const productData = new FormData()
    productData.append('title', title)
    productData.append('caption', caption)
    productData.append('category', category)
    productData.append('stock', stock)
    productData.append('price', price)
    productData.append('address', completeAddress)
    productData.append('packaging', packaging) // Add packaging field

    images.forEach((image) => {
      productData.append('images', image)
    })

    const token = localStorage.getItem('token')

    try {
      await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      toast.success('Product posted, wait for admin approval!')
      setTrigger((prevState) => prevState + 1)
      resetForm()
    } catch (error) {
      setMessage('Error posting product: ' + error.message)
    } finally {
      setLoadingSubmit(false) // Set loading to false once the submission is complete
    }
  }

  // Reset the form after successful submission
  const resetForm = () => {
    setTitle('')
    setCaption('')
    setStock('')
    setPrice('')
    setImages([])
    setShowForm(false)
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  // Handle search for products
  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!query) {
      setSearchResults([])
      setNotFoundSearch('')
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/search/all-products`,
        {
          params: { query },
        }
      )

      const token = localStorage.getItem('token')
      let userIdToExclude = null

      if (token) {
        const decodedToken = jwtDecode(token)
        userIdToExclude = decodedToken.id
      }

      const filteredResults = response.data.filter(
        (product) => product.userId._id !== userIdToExclude
      )

      setSearchResults(filteredResults)
      setNotFoundSearch('') // Reset not found message if search results exist
    } catch (error) {
      if (error?.response?.data?.message === 'Product not found') {
        setNotFoundSearch(error?.response?.data?.message)
        setSearchResults([]) // Reset search results if no products found
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='text-center my-4'>
        <button
          onClick={() => setShowForm(!showForm)}
          className='py-1 px-3 rounded-lg border-main bg-main text-white shadow-lg'
          disabled={userStatus === 'not_verified'} // Disable button if not verified
        >
          {showForm ? 'Hide Form' : 'Do you like to post your product?'}
        </button>
      </div>
      {showForm && (
        <div className='max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white my-10'>
          <h2 className='text-xl font-bold mb-4'>Post Your Product</h2>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='title'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Product Title
              </label>
              <input
                type='text'
                id='title'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter product title'
                required
              />
            </div>
            <div>
              <label
                htmlFor='caption'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Caption
              </label>
              <textarea
                id='caption'
                className='textarea textarea-bordered w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Write a caption...'
              />
            </div>
            <div>
              <label
                htmlFor='category'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Category
              </label>
              <select
                id='category'
                className='select select-bordered w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value='crops'>Crops</option>
                <option value='fisheries'>Fisheries</option>
                <option value='livestock'>Livestock</option>
                <option value='uncategorized'>Uncategorized</option>
              </select>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <label
                  htmlFor='stock'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Stock
                </label>
                <input
                  type='number'
                  id='stock'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder='Enter stock amount'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='price'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Price
                </label>
                <input
                  type='number'
                  id='price'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder='Enter price'
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='packaging'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Packaging/Quantity Measurement
              </label>
              <select
                id='packaging'
                className='select select-bordered w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5'
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              >
                <option value='per kilo'>Per Kilo</option>
                <option value='per sack'>Per Sack</option>
                <option value='per bundle'>Per Bundle</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='images'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Upload Images
              </label>
              <input
                type='file'
                id='images'
                multiple
                required
                accept='image/*'
                onChange={handleImageChange}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
            </div>

            <button
              type='submit'
              className='py-1 px-3 rounded-lg border-main bg-main text-white shadow-lg'
              disabled={loadingSubmit} // Disable the button when submitting
            >
              {loadingSubmit ? 'Posting...' : 'Post Product'}
            </button>
          </form>
        </div>
      )}
      <div className='my-4 container px-4 mt-10'>
        <input
          type='text'
          placeholder='Search for products...'
          value={searchQuery}
          onChange={handleSearch}
          className='input input-bordered w-full'
        />
      </div>
      {notFoundSearch ? (
        <div className='text-red-500 font-bold container px-4'>
          Product Not Found
        </div>
      ) : (
        ''
      )}
      {loading ? (
        <div className='flex flex-col space-y-4'>
          <div className='h-10 bg-gray-200 rounded-lg animate-pulse'></div>
          <div className='h-10 bg-gray-200 rounded-lg animate-pulse'></div>
          <div className='h-10 bg-gray-200 rounded-lg animate-pulse'></div>
        </div>
      ) : userStatus !== 'not_verified' ? (
        <ProductList productsTest={searchResults} trigger={trigger} />
      ) : (
        <div className='text-red-500 font-bold text-center'>
          You need to verify your account before posting a product.
        </div>
      )}
    </div>
  )
}

export default PostProduct
