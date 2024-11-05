import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import ContactUsText from './ContactUsText'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ContactUsForm = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)

        axios
          .get(`${import.meta.env.VITE_DEV_BACKEND_URL}/users/${decoded.id}`)
          .then((response) => {
            setUser(response.data)
            setLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
            setLoading(false)
          })
      } catch (error) {
        console.error('Error decoding token:', error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!message.trim()) {
      setError('Please enter a message.')
      setIsSubmitting(false)
      return
    }
    if (!user?.firstName || !user?.lastName || !user?.email) {
      setError('Please make sure your personal details are complete.')
      setIsSubmitting(false)
      return
    }

    setError('')

    const contactData = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      message,
    }

    axios
      .post(`${import.meta.env.VITE_DEV_BACKEND_URL}/contacts`, contactData)
      .then((response) => {
        setIsSubmitting(false)

        setMessage('')

        toast.success('Your message has been sent successfully!')
      })
      .catch((error) => {
        setIsSubmitting(false)
        console.error('Error submitting contact form:', error)

        toast.error('Something went wrong. Please try again later.')
      })
  }

  return (
    <div className='md:w-[90%] w-[80%] mx-auto my-10 container'>
      <ContactUsText />

      <div className='flex flex-col justify-center items-center gap-4 mt-16'>
        <p className='text-main font-bold'>Contact Us</p>
        <p className='text-center text-xl md:text-3xl text-[#234664] xl:px-[20vw]'>
          Contact us for a personalized experience.
        </p>
      </div>
      <div
        id='contact'
        className='lg:flex gap-8 py-16'
        style={{ backgroundColor: 'white' }}
      >
        <div className='flex flex-col flex-1 text-sm text-gray-400 py-8 md:px-16 px-4 gap-8 rounded-3xl bg-white border border-gray-400'>
          <h1 className='text-xl text-black font-semibold'>Personal Detail</h1>
          <div className='md:flex justify-between gap-8 space-y-4 md:space-y-0'>
            <div className='flex w-full gap-2 flex-col'>
              <label htmlFor='first-name'>First Name</label>
              {loading ? (
                <div className='skeleton rounded-lg h-10 w-full'></div>
              ) : (
                <input
                  className='py-3 px-4 border min-w-[200px] border-gray-300 focus:outline-[#51BA80] rounded-lg'
                  type='text'
                  id='first-name'
                  value={user?.firstName || ''}
                  placeholder='Your first name *'
                  disabled={loading}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />
              )}
            </div>
            <div className='flex gap-2 md:pt-0 w-full flex-col'>
              <label htmlFor='last-name'>Last Name</label>
              {loading ? (
                <div className='skeleton rounded-lg h-10 w-full'></div>
              ) : (
                <input
                  className='py-3 px-4 border min-w-[200px] border-gray-300 focus:outline-[#51BA80] rounded-lg'
                  type='text'
                  id='last-name'
                  value={user?.lastName || ''}
                  placeholder='Your last name *'
                  disabled={loading}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />
              )}
            </div>
          </div>
          <div className='flex gap-2 md:pt-0 w-full flex-col'>
            <label htmlFor='email'>Email</label>
            {loading ? (
              <div className='skeleton rounded-lg h-10 w-full'></div>
            ) : (
              <input
                className='py-3 px-4 border min-w-[200px] border-gray-300 focus:outline-[#51BA80] rounded-lg'
                type='email'
                id='email'
                value={user?.email || ''}
                placeholder='Your email *'
                disabled={loading}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            )}
          </div>

          <div className='flex gap-2 w-full flex-col'>
            <label htmlFor='message'>Message</label>
            <textarea
              id='message'
              className='py-3 px-4 border min-w-[200px] border-gray-300 focus:outline-[#51BA80] rounded-xl h-32 resize-none'
              placeholder='Write your message here...'
              value={message}
              onChange={handleMessageChange}
            />
            {error && <p className='text-red-500 text-sm'>{error}</p>}
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleFormSubmit}
              className='py-2 rounded-lg border-main bg-main text-white shadow-lg px-3'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send a message'}
            </button>
          </div>
        </div>

        <div
          className='flex mt-8 lg:mt-0 flex-col bg-blend-multiply bg-gray-700 bg-opacity-60 justify-between gap-12 py-2 flex-[0.5] bg-cover box-border text-left text-white rounded-3xl w-full'
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpb8r7bqq/image/upload/v1721837633/hero-slider-img-3_klmsdx.webp')",
          }}
        >
          <div className='flex flex-col gap-4 py-4'>
            <h1 className='text-xl px-4'>Company Details</h1>
            <p className='text-left text-gray-300 text-xs md:text-sm px-4'>
              Consulting provides comprehensive business solutions globally.
              With a team of experienced professionals, they offer tailored
              services in business strategy, financial consulting, market
              research, and IT solutions. Their innovative approach ensures
              operational efficiency and digital transformation for businesses
              of all sizes. Known for excellence and customer satisfaction,
              Infinity Consulting is a trusted partner in driving business
              success.
            </p>
          </div>

          <div className='flex justify-center'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://twitter.com/'
              className='h-[40px] w-[40px] rounded-lg shadow-lg p-1'
            >
              <Icon
                className='h-full w-full'
                icon='fa6-brands:square-x-twitter'
              />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.facebook.com/'
              className='h-[40px] w-[40px] rounded-lg shadow-lg p-1'
            >
              <Icon className='h-full w-full' icon='mage:facebook-square' />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.whatsapp.com/'
              className='h-[40px] w-[40px] rounded-lg shadow-lg p-1'
            >
              <Icon className='h-full w-full' icon='uim:whatsapp' />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.instagram.com/'
              className='h-[40px] w-[40px] rounded-lg shadow-lg p-1'
            >
              <Icon
                className='h-full w-full'
                icon='icon-park-outline:instagram'
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUsForm
