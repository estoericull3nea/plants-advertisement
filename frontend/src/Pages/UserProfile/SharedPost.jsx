import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast' // Import React Hot Toast
import { useParams, Link } from 'react-router-dom' // Import Link from react-router-dom

const SharedPost = ({ isVisitor }) => {
  const [sharedPosts, setSharedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { userId } = useParams()

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/shares/user/${userId}`
        )
        setSharedPosts(response.data.shares)
      } catch (err) {
        setError('Failed to fetch shared posts.')
      } finally {
        setLoading(false)
      }
    }

    fetchSharedPosts()
  }, [userId])

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/shares/${postId}`
      )
      setSharedPosts(sharedPosts.filter((post) => post._id !== postId))
      toast.success('Post deleted successfully.') // Use hot toast for success
    } catch (err) {
      toast.error('Error deleting the post.') // Use hot toast for error
    }
  }

  return (
    <section className='bg-white py-10'>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
          Shared Posts
        </h1>

        {loading ? (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className='flex flex-col items-center bg-white p-4 rounded-lg shadow-md'
              >
                <div className='w-full h-48 bg-gray-300 animate-pulse rounded-md mb-4'></div>
                <div className='h-6 w-2/3 bg-gray-300 animate-pulse mb-2'></div>
                <div className='h-4 w-1/2 bg-gray-300 animate-pulse'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {sharedPosts.length > 0 ? (
              sharedPosts.map((post) => (
                <div
                  key={post._id}
                  className='card w-full bg-base-100 shadow-lg rounded-xl transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50'
                >
                  <figure>
                    <Link
                      to={`/products/${
                        post.productId ? post.productId._id : ''
                      }`} // Make the product clickable
                    >
                      <img
                        src={
                          post.productId
                            ? `http://localhost:5000/${post.productId.images[0]}`
                            : '/default-product-image.jpg'
                        }
                        alt={post.productId ? post.productId.title : 'No Image'}
                        className='w-full h-48 object-cover rounded-t-xl'
                      />
                    </Link>
                  </figure>
                  <div className='card-body'>
                    <h2 className='card-title'>
                      {post.productId ? post.productId.title : 'No Product'}
                    </h2>
                    <p className='text-sm'>
                      {post.productId
                        ? post.productId.caption
                        : 'No description available.'}
                    </p>
                    <div className='card-actions justify-end'>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className={`btn btn-error btn-sm ${
                          isVisitor ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={isVisitor} // Disable the button for visitors
                        title={
                          isVisitor
                            ? 'You cannot delete this post as a visitor.'
                            : 'Delete this post'
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center w-full col-span-full text-gray-600'>
                No shared posts available.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default SharedPost
