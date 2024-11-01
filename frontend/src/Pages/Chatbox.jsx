import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
const socket = io('http://localhost:5000')

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
              className='max-w-full max-h-screen object-cover'
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

  const messagesEndRef = useRef(null) // Reference for scrolling

  useEffect(() => {
    const socket = io('http://localhost:5000')

    fetchCurrentUser()
    fetchUsers()

    socket.on('message', (newMessage) => {
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
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      const filteredUsers = response.data.filter(
        (user) => user._id !== currentUserId
      )
      setUsers(filteredUsers)
    } catch (error) {
      if (error.response.data.message === 'Unauthorized! Invalid token.') {
        toast.error('Please login again')
        localStorage.clear()
        navigate('/login')
      }
      console.error(error)
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

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId)
    fetchMessages(userId)
  }

  const getFullImageUrl = (filename) => {
    return `http://localhost:5000/${filename}`
  }

  const handleImageClick = (index) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  return (
    <div className='flex h-screen container my-10 gap-3'>
      <div className='w-1/5 border-r p-4'>
        <h2 className='text-xl font-bold'>Users</h2>
        {loadingUsers ? (
          <div className='flex flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className='p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center'
              onClick={() => handleUserSelect(user._id)}
            >
              <span>
                {user.firstName} {user.lastName}
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
                    <div>{message.text}</div>
                    <div className='text-xs text-gray-500'>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
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
          <form onSubmit={handleSendMessage} className='flex mt-10 w-full'>
            <input
              type='text'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type a message...'
              className='border border-gray-300 rounded-l-lg p-2 flex-1'
              disabled={!selectedUserId}
            />
            <input
              type='file'
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className='border border-gray-300 rounded-lg mx-2'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white rounded-lg px-4'
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
