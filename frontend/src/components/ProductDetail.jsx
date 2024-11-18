import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { IoIosShareAlt } from 'react-icons/io'
import 'swiper/css'
import 'swiper/css/pagination'
import RelatedProducts from './RelatedProducts'
const socket = io('https://plants-advertisement.onrender.com')
import { io } from 'socket.io-client'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [togglingLike, setTogglingLike] = useState(false)
  const [likesUsers, setLikesUsers] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [sharing, setSharing] = useState(false)

  const [messageText, setMessageText] = useState('Is this available?')

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText) return // Ensure there's text to send

    const receiverId = product.userId._id // Assuming product.userId contains the seller's info

    const productLink = `Check out this product: ${window.location.origin}/products/${product._id}` // Link to product page
    const updatedMessageText = `${messageText}\n\n${productLink}`

    const formData = new FormData()
    formData.append('receiverId', receiverId)
    formData.append('text', updatedMessageText)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/chats/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      socket.emit('message', response.data) // Emit the newly created message

      // Reset the input field
      toast.success('Message Sent Successfully')
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === 'Unauthorized! Invalid token.'
      ) {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      } else {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleShare = async () => {
    setSharing(true)
    const userId = localStorage.getItem('userId')

    try {
      await axios.post(`${import.meta.env.VITE_DEV_BACKEND_URL}/shares/track`, {
        productId: product._id,
        userId,
      })
      toast.success('Post shared successfully!')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setSharing(false)
    }
  }

  const fetchComments = async () => {
    if (!product) return
    setLoadingComments(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/comments/${product._id}`
      )
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')

    try {
      await axios.post(`${import.meta.env.VITE_DEV_BACKEND_URL}/comments`, {
        productId: product._id,
        userId,
        content: newComment,
      })

      setNewComment('')
      toast.success('Comment added successfully!')
      fetchComments()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const fetchLikesUsers = async (productId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/likes/product/${productId}`
      )
      setLikesUsers(response.data)
    } catch (error) {
      console.error('Error fetching likes users:', error)
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/products/${id}`
      )
      setProduct(response.data)
      await checkIfLiked(response.data._id)
      await fetchLikeCount(response.data._id)
      await fetchLikesUsers(response.data._id)
      await fetchComments()
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async (productId) => {
    const userId = localStorage.getItem('userId')
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/likes/user/${userId}/product/${productId}`
      )
      setLiked(response.data.length > 0)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const fetchLikeCount = async (productId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/likes/count/product/${productId}`
      )
      setLikeCount(response.data.count)
    } catch (error) {
      console.error('Error fetching like count:', error)
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
      }))

      setQuantity(1)
      socket.emit('updateCartCount', 'cartCount')
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleToggleLike = async () => {
    setTogglingLike(true)
    try {
      const userId = localStorage.getItem('userId')

      await axios.post(`${import.meta.env.VITE_DEV_BACKEND_URL}/likes/toggle`, {
        userId,
        productId: product._id,
      })

      setLiked((prevLiked) => !prevLiked)
      await fetchLikeCount(product._id)
      await fetchLikesUsers(product._id)
      toast.success(`Product ${liked ? 'disliked' : 'liked'} successfully!`)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setTogglingLike(false)
    }
  }

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex flex-col md:flex-row'>
          <div className='skeleton rounded-md h-[500px] w-full md:w-1/2 mr-4 mt-12'></div>
          <div className='w-full md:w-1/2'>
            <div className='flex justify-end'>
              <div className='skeleton rounded-md h-8 w-32 mb-4 mt-3'></div>
            </div>
            <div className='skeleton rounded-md h-[300px] w-full mb-4'></div>
            <div className='flex gap-x-3'>
              <div className='skeleton rounded-md h-8 w-[80%] mb-2'></div>
              <div className='skeleton rounded-md h-8 w-[20%] mb-2'></div>
            </div>
            <div className='skeleton rounded-md h-8 w-full mb-2'></div>
            <div className='skeleton rounded-md h-8 w-full mb-2'></div>
            <div className='skeleton rounded-md h-8 w-full mb-2'></div>
            <div className='skeleton rounded-md h-8 w-full mb-2'></div>
            <div className='skeleton rounded-md h-8 w-full mb-2'></div>
            <div className='flex gap-x-3'>
              <div className='skeleton rounded-md h-8 w-[60%] mb-2'></div>
              <div className='skeleton rounded-md h-8 w-[20%] mb-2'></div>
              <div className='skeleton rounded-md h-8 w-[20%] mb-2'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='container py-10 text-center font-bold'>
        Product not found
      </div>
    )
  }

  if (!product.isAvailable) {
    return (
      <div className='container py-10 text-center font-bold'>
        This product is not available yet
      </div>
    )
  }

  const totalPrice = product.price * quantity

  return (
    <div className='container mx-auto p-4'>
      <div className='text-end'>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success('URL copied to clipboard!')
          }}
          className='py-1 px-3 mb-3 rounded-lg border-main bg-main text-white shadow-lg'
        >
          Copy Product URL
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <div className='w-full  pr-4 mb-4 md:mb-0'>
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
                  src={`https://plants-advertisement.onrender.com/${image}`}
                  className='rounded-box w-full h-full object-cover'
                  alt={`Product Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='w-full  border p-3 shadow-lg rounded-lg text-sm'>
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
              className='px-3 py-3 rounded-lg border-main bg-main text-white shadow-lg'
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
                  <td className='border px-4 py-2 underline text-blue-600'>
                    <div className='tooltip' data-tip='View Profile'>
                      <Link
                        to={`${import.meta.env.VITE_DEV_FRONTEND_URL}/profile/${
                          product.userId._id
                        }/user-info`}
                      >
                        {' '}
                        {product.userId.firstName || 'N/A'}{' '}
                        {product.userId.lastName || 'N/A'}
                      </Link>
                    </div>
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

          <div className='flex gap-3'>
            <button
              className='mt-4 underline'
              onClick={() => {
                fetchLikesUsers(product._id)
                setShowLikesModal(true)
              }}
            >
              Show Likes ({likeCount})
            </button>

            <button
              className='mt-4 underline'
              onClick={() => {
                fetchComments()
                setShowCommentsModal(true)
              }}
            >
              Show Comments ({comments.length})
            </button>
          </div>

          {showCommentsModal && (
            <dialog open className='modal'>
              <div className='modal-box'>
                <form method='dialog'>
                  <button
                    className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                    onClick={() => setShowCommentsModal(false)}
                  >
                    ✕
                  </button>
                </form>
                <h3 className='font-bold text-lg'>Comments</h3>
                {loadingComments ? (
                  <div>Loading comments...</div>
                ) : (
                  <ul className='mt-4'>
                    {comments.map((comment) => {
                      const currentUserId = localStorage.getItem('userId')
                      const isCurrentUser = comment.userId._id === currentUserId

                      return (
                        <li key={comment._id} className='border p-2 my-2'>
                          <strong>
                            {isCurrentUser
                              ? 'You'
                              : `${comment.userId.firstName} ${comment.userId.lastName}`}
                          </strong>
                          : {comment.content}
                          <div className='text-gray-500 text-sm'>
                            {new Date(comment.createdAt).toLocaleString()}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
                <form onSubmit={handleAddComment} className='flex mt-4'>
                  <input
                    type='text'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className='border rounded p-2 flex-1'
                    placeholder='Add a comment...'
                    required
                  />
                  <button
                    type='submit'
                    className='bg-main text-white rounded px-4 py-2 ml-2'
                  >
                    Submit
                  </button>
                </form>
              </div>
            </dialog>
          )}

          {showLikesModal && (
            <dialog open className='modal'>
              <div className='modal-box'>
                <form method='dialog'>
                  <button
                    className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                    onClick={() => setShowLikesModal(false)}
                  >
                    ✕
                  </button>
                </form>
                <h3 className='font-bold text-lg'>Likes</h3>
                <ul className='mt-4'>
                  {likesUsers.map((user) => (
                    <li key={user._id}>
                      <button
                        onClick={() => handleUserClick(user._id)}
                        className='text-blue-600 underline'
                      >
                        {`${user.userId.firstName} ${user.userId.lastName}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </dialog>
          )}

          <div className='flex items-center flex-wrap mt-4 gap-3  justify-start lg:justify-between w-full'>
            <button
              onClick={handleToggleLike}
              className={`py-1 px-3 flex gap-2 items-center rounded-lg border-main bg-main text-white shadow-lg ${
                togglingLike ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={togglingLike}
            >
              <span>{liked ? <FaHeart /> : <FaRegHeart />}</span>
              <span>
                {togglingLike ? 'Processing...' : liked ? 'Dislike' : 'Like'} (
                {likeCount})
              </span>
            </button>

            <form
              onSubmit={handleAddComment}
              className='flex items-center flex-wrap gap-3 lg:ml-4'
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='border rounded p-2 mr-2'
                placeholder='Add a comment...'
                required
                rows='1'
              />
              <button
                type='submit'
                className='py-1 rounded-lg border-main bg-main text-white shadow-lg px-3'
              >
                Submit
              </button>
            </form>

            <div className='tooltip' data-tip='Share this Post'>
              <button
                onClick={handleShare}
                className={`py-1 rounded-lg border-main bg-main text-white shadow-lg px-3  ${
                  sharing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={sharing}
              >
                {sharing ? (
                  <div className='flex items-center gap-1'>
                    <IoIosShareAlt className='spinner-icon' /> Sharing...
                  </div>
                ) : (
                  <div className='flex items-center gap-1'>
                    <IoIosShareAlt /> Share
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className='flex items-center flex-wrap mt-4 gap-3'>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className='border rounded p-2 flex-1'
              placeholder='Type your message...'
              required
              rows='2'
            />
            <button
              onClick={handleSendMessage}
              className={`py-1 rounded-lg border-main bg-main text-white shadow-lg px-3`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts category={product.category} productId={product._id} />
    </div>
  )
}

export default ProductDetail
