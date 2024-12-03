import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Link } from 'react-router-dom'

import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
const socket = io('https://plants-advertisement.onrender.com')

const extractLink = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g
  const match = text.match(urlRegex)
  return match ? match[0] : null // Return the first link if it exists, otherwise null
}

const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname // Extracts the domain from the URL
    return domain
  } catch (e) {
    return null // In case the URL is invalid
  }
}

const ImageModal = ({ images, isOpen, onClose, startIndex }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80'>
      <Swiper
        pagination={{ clickable: true }}
        navigation
        modules={[Pagination, Navigation, Autoplay]}
        initialSlide={startIndex}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <img
              src={image}
              alt='Full size'
              className='max-w-full max-h-auto object-cover'
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        className='absolute top-4 right-4 text-white text-2xl'
        onClick={onClose}
      >
        &times; {/* Close button */}
      </button>
    </div>
  )
}

const Chatbox = () => {
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [text, setText] = useState('')
  const [images, setImages] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const currentUserId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [filteredUsers, setFilteredUsers] = useState([])

  const [searchQuery, setSearchQuery] = useState('')

  const messagesEndRef = useRef(null) // Reference for scrolling

  useEffect(() => {
    const socket = io('https://plants-advertisement.onrender.com')

    fetchCurrentUser()
    fetchUsers()

    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
      scrollToBottom()
    })

    socket.on('userStatusUpdate', ({ userId, online }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev)
        if (online) {
          updated.add(userId)
        } else {
          updated.delete(userId)
        }
        return updated
      })
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
      socket.emit('join', currentUserId)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    return () => {
      socket.off('message')
      socket.off('userStatusUpdate')
      socket.disconnect()
    }
  }, [currentUserId])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    scrollToBottom()
  }, [messages])

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setCurrentUser(response.data)
    } catch (error) {
      if (error.response.data.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/chats/users-with-conversations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setUsers(response.data)
    } catch (error) {
      if (error.response?.data?.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
      console.error('Error fetching users with conversations:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchMessages = async (userId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/chats/${userId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setMessages(response.data)
    } catch (error) {
      if (error.response.data.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
      console.error(error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text && images.length === 0) return

    const formData = new FormData()
    formData.append('receiverId', selectedUserId)
    formData.append('text', text)
    images.forEach((image) => {
      formData.append('images', image)
    })

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

      // Reset input fields
      setText('')
      setImages([])

      fetchMessages(selectedUserId)
    } catch (error) {
      if (error.response.data.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, users])

  useEffect(() => {
    console.log('Filtered Users:', filteredUsers) // Debugging: Ensure this is updating as expected
  }, [filteredUsers])

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId)
    fetchMessages(userId)
  }

  const getFullImageUrl = (filename) => {
    return `https://plants-advertisement.onrender.com/${filename}`
  }

  const handleImageClick = (index) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Never active'
    const now = new Date()
    const lastActive = new Date(timestamp)
    const diff = now - lastActive

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  useEffect(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto' // Reset height to auto
      textarea.style.height = `${textarea.scrollHeight}px` // Set height based on scrollHeight
    }
  }, [text]) // Trigger this effect when the `text` changes

  return (
    <div className='flex flex-col md:flex-row h-auto container my-10 gap-3'>
      <div className='md:w-1/5 border-r p-4'>
        <h2 className='text-xl font-bold'>Users</h2>

        <input
          type='text'
          placeholder='Search users...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full'
        />

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className='p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center'
            onClick={() => handleUserSelect(user._id)}
          >
            <span>
              {user.firstName} {user.lastName}
            </span>
            <span className='text-gray-500 text-sm'>
              {formatLastActive(user.lastActive)}
            </span>
            {onlineUsers.has(user._id) ? (
              <span className='text-green-500'>●</span> // Green dot for online
            ) : (
              <span className='text-red-500'>●</span> // Red dot for offline
            )}
          </div>
        ))}

        {loadingUsers ? (
          <div className='flex flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className='p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center'
              onClick={() => handleUserSelect(user._id)}
            >
              <span>
                {user.firstName} {user.lastName}
              </span>
              <span className='text-gray-500 text-sm'>
                {formatLastActive(user.lastActive)}
              </span>
              {onlineUsers.has(user._id) ? (
                <span className='text-green-500'>●</span> // Green dot for online
              ) : (
                <span className='text-red-500'>●</span> // Red dot for offline
              )}
            </div>
          ))
        )}
      </div>

      <div className='w-full'>
        {currentUser && (
          <div className='flex items-center mb-4'>
            <div className='text-lg font-bold'>
              {currentUser.firstName} {currentUser.lastName}
            </div>
          </div>
        )}

        <div className='border rounded-lg shadow-lg p-4 flex-1 h-full'>
          <div className='space-y-2 h-full overflow-y-auto p-2 border-b'>
            {messages.length === 0 ? (
              <div className='text-center p-4 text-gray-500'>No messages</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex mb-2 ${
                    message.senderId._id === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      message.senderId._id === currentUserId
                        ? 'bg-green-100 text-black'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <div className='font-semibold'>
                      {message.senderId.firstName} {message.senderId.lastName}
                    </div>

                    {/* Conditionally render message text */}
                    <div>
                      {extractLink(message.text) ? (
                        <>
                          {message.text.replace(extractLink(message.text), '')}{' '}
                          {/* Display text without the link */}
                          <a
                            href={extractLink(message.text)}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500'
                          >
                            {extractDomain(extractLink(message.text))}{' '}
                            {/* Display the domain name */}
                          </a>
                        </>
                      ) : (
                        // If no link is found, display the message as is
                        message.text
                      )}
                    </div>

                    {/* Product Preview */}
                    {message.productPreview && (
                      <div className='rounded-2xl bg-main border shadow border-black w-max my-3 p-3 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg'>
                        <Link to={message?.productPreview?.url}>
                          <h3 className='text-lg font-semibold hover:text-blue-500 transition-all'>
                            {message?.productPreview?.title}
                          </h3>
                          <img
                            src={`https://plants-advertisement.onrender.com/${message?.productPreview?.image}`}
                            alt={message?.productPreview?.image}
                            className='h-36 w-full rounded-lg transition-transform transform hover:scale-105'
                          />
                          <p>{message?.productPreview?.description}</p>
                        </Link>
                      </div>
                    )}

                    <div className='text-xs text-gray-500'>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>

                    {/* Images */}
                    {Array.isArray(message.images) &&
                      message.images.length > 0 && (
                        <div className='flex space-x-2 mt-2'>
                          {message.images.map((image, index) => (
                            <img
                              key={image}
                              src={getFullImageUrl(image)}
                              alt='Message attachment'
                              className='w-20 h-20 rounded-md cursor-pointer'
                              onClick={() => handleImageClick(index)}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />{' '}
            {/* Empty div to act as a scroll target */}
          </div>
          <form
            onSubmit={handleSendMessage}
            className='flex flex-col gap-3 md:flex-row mt-10 w-full'
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type a message...'
              className='border border-gray-300 rounded-l-lg p-2 flex-1 resize-none'
              disabled={!selectedUserId}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  // Check if Enter is pressed without Shift (to avoid new line)
                  e.preventDefault() // Prevent adding a new line
                  handleSendMessage(e) // Call the send message function
                }
              }}
            />

            <input
              type='file'
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className='border border-gray-300 rounded-lg mx-2'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white rounded-lg px-4 py-3'
              disabled={!selectedUserId}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={messages.flatMap((msg) =>
          Array.isArray(msg.images) ? msg.images.map(getFullImageUrl) : []
        )}
        isOpen={selectedImageIndex !== null}
        onClose={closeImageModal}
        startIndex={selectedImageIndex}
      />
    </div>
  )
}

export default Chatbox
