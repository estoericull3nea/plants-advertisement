import React, { useState } from 'react'
import Logo from '../../src/assets/logo/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/auth/login`,
        { email, password }
      )

      localStorage.setItem('token', response.data.token)
      const { id: userId } = jwtDecode(response.data.token)
      localStorage.setItem('userId', userId)
      toast.success('Login successful')
      navigate(`/profile/${userId}/user-info`)
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Login failed')
      } else {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <section className='bg-gray-50'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <Link
            to='/'
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900'
          >
            <img className='w-8 h-8 mr-2' src={Logo} alt='logo' />
            FarmMart
          </Link>
          <div className='w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                Login to your account
              </h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 text-sm font-medium text-gray-900'
                  >
                    Your email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                    placeholder='john@company.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block mb-2 text-sm font-medium text-gray-900'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type='submit'
                  className={`w-full text-black border border-black ${
                    isLoading
                      ? 'bg-gray-400'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <p className='text-sm font-light text-gray-500'>
                  Don't have an account?{' '}
                  <Link
                    to='/register'
                    className='font-medium text-primary-600 hover:underline'
                  >
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
