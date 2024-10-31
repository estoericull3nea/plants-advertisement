import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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
  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null) // Track current image index in the carousel
  const currentUserId = localStorage.getItem('userId')

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
      toast.error('Error fetching users')
      console.error(error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchMessages = async (userId) => {
    const token = localStorage.getItem('token')
    setLoading(true)
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
      toast.error('Error fetching messages')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text && images.length === 0) return

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      text: text || '',
      images: [...images].map((file) => file.name),
      _id: Date.now(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    const formData = new FormData()
    formData.append('receiverId', selectedUserId)
    formData.append('text', text)
    images.forEach((image) => {
      formData.append('images', image)
    })

    try {
      await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/chats/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setText('')
      setImages([])
    } catch (error) {
      toast.error('Error sending message')
      console.error(error)
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

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className='flex h-screen'>
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
              className='p-2 border-b hover:bg-gray-100 cursor-pointer'
              onClick={() => handleUserSelect(user._id)}
            >
              {user.firstName} {user.lastName}
            </div>
          ))
        )}
      </div>

      <div className='chat-box w-4/5 border rounded-lg shadow-lg p-4 flex-1'>
        <div className='messages space-y-2 max-h-80 overflow-y-auto p-2 border-b'>
          {loading ? (
            <div className='flex flex-col gap-4'>
              <div className='skeleton h-32 w-full'></div>
              <div className='skeleton h-4 w-28'></div>
              <div className='skeleton h-4 w-full'></div>
              <div className='skeleton h-4 w-full'></div>
            </div>
          ) : messages.length === 0 ? (
            <div className='text-center p-4 text-gray-500'>No messages</div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === currentUserId ? 'chat-end' : 'chat-start'
                }`}
              >
                <div className='chat-bubble'>
                  {message.text}
                  {Array.isArray(message.images) &&
                    message.images.length > 0 && (
                      <div className='flex space-x-2'>
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
        </div>
        <form onSubmit={handleSendMessage} className='message-form flex mt-4'>
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
