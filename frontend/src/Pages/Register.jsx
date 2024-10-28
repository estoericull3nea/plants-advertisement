import React, { useEffect, useState } from 'react'
import Logo from '../../src/assets/logo/logo.png'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Register = () => {
  const [barangays, setBarangays] = useState([])
  const [filteredBarangays, setFilteredBarangays] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    municipality: '',
    barangay: '',
    password: '',
    confirmPassword: '',
    idImage: null,
  })

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(
          'https://psgc.cloud/api/regions/0100000000/municipalities'
        )
        const data = await response.json()
        setMunicipalities(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching municipalities:', error)
        setLoading(false)
      }
    }

    fetchMunicipalities()
  }, [])

  const handleMunicipalityChange = async (e) => {
    const { value } = e.target

    // Update formData for municipality
    setFormData((prevData) => ({
      ...prevData,
      municipality: value,
      barangay: '', // Reset barangay when municipality changes
    }))

    // Fetch barangays based on selected municipality
    try {
      const response = await fetch(
        ` https://psgc.cloud/api/municipalities/${value}/barangays`
      )

      const data = await response.json()
      setFilteredBarangays(data)
    } catch (error) {
      console.error('Error fetching barangays:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      idImage: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true)
    e.preventDefault()
    const form = new FormData()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    for (const key in formData) {
      form.append(key, formData[key])
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/auth/register`,
        {
          method: 'POST',
          body: form,
        }
      )

      const result = await response.json()

      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          municipality: '',
          barangay: '',
          password: '',
          confirmPassword: '',
          idImage: null,
        }))

        toast.success('User Registered')
      } else {
        // Display error messages
        if (result.errors) {
          // Assuming `result.errors` is an array of error messages
          result.errors.forEach((error) => {
            toast.error(error.msg) // Display each error message
          })
        } else {
          // Handle generic error
          toast.error('An error occurred. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }
  if (loading) {
    return (
      <div className='bg-gray-50 py-10'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
          <div className='w-full bg-white  shadow md:mt-0 sm:max-w-md xl:p-0'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='skeleton h-8 w-48'></h1> {/* Title Skeleton */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <div className='skeleton h-10 w-full'></div>{' '}
                  {/* First Name Skeleton */}
                </div>
                <div>
                  <div className='skeleton h-10 w-full'></div>{' '}
                  {/* Last Name Skeleton */}
                </div>
              </div>
              <div>
                <div className='skeleton h-10 w-full'></div>{' '}
                {/* Email Skeleton */}
              </div>
              <div>
                <div className='skeleton h-10 w-full'></div>{' '}
                {/* Contact Number Skeleton */}
              </div>
              <div>
                <div className='skeleton h-10 w-full'></div>{' '}
                {/* ID Image Skeleton */}
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <div className='skeleton h-10 w-full'></div>{' '}
                  {/* Municipality Skeleton */}
                </div>
                <div>
                  <div className='skeleton h-10 w-full'></div>{' '}
                  {/* Barangay Skeleton */}
                </div>
              </div>
              <div>
                <div className='skeleton h-10 w-full'></div>{' '}
                {/* Password Skeleton */}
              </div>
              <div>
                <div className='skeleton h-10 w-full'></div>{' '}
                {/* Confirm Password Skeleton */}
              </div>
              <div className='text-end'>
                <div className='skeleton h-4 w-32'></div>{' '}
                {/* Forgot Password Skeleton */}
              </div>
              <div className='skeleton h-12 w-full'></div>{' '}
              {/* Submit Button Skeleton */}
              <p className='skeleton h-4 w-60'></p>{' '}
              {/* Account Check Skeleton */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className='bg-gray-50 py-10'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
          <Link
            to='/'
            className='flex items-center mb-6 text-2xl font-semibold text-gray-900'
          >
            <img className='w-8 h-8 mr-2' src={Logo} alt='logo' />
            FarmMart
          </Link>
          <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                Create an account
              </h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <label
                      htmlFor='first-name'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      First Name
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      id='first-name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      placeholder='John'
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='last-name'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      id='last-name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      placeholder='Doe'
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

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
                    placeholder='name@company.com'
                    required
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='contact-number'
                    className='block mb-2 text-sm font-medium text-gray-900'
                  >
                    Contact Number
                  </label>
                  <input
                    type='tel'
                    name='contactNumber'
                    id='contact-number'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                    placeholder='09151341234 or 9151341234'
                    required
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='id-image'
                    className='block mb-2 text-sm font-medium text-gray-900'
                  >
                    Upload Valid ID
                  </label>
                  <input
                    type='file'
                    name='idImage'
                    id='id-image'
                    accept='image/*'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                    required
                    onChange={handleFileChange}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <label
                      htmlFor='municipality'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Municipality
                    </label>
                    <select
                      name='municipality'
                      id='municipality'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      required
                      onChange={handleMunicipalityChange} // Using the updated function
                    >
                      <option value=''>Select Municipality</option>
                      {municipalities.map((municipality, index) => (
                        <option key={index} value={municipality.name}>
                          {municipality.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='barangay'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Barangay
                    </label>
                    <select
                      name='barangay'
                      id='barangay'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      required
                      onChange={handleChange}
                    >
                      <option value=''>Select Barangay</option>
                      {filteredBarangays.map((barangay, index) => (
                        <option key={index} value={barangay.name}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='confirm-password'
                    className='block mb-2 text-sm font-medium text-gray-900'
                  >
                    Confirm password
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    id='confirm-password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                    required
                    onChange={handleChange}
                  />
                </div>

                <span></span>

                <div className='text-end'>
                  <Link to='/forgot' className='text-sm text-end'>
                    Forgot password?
                  </Link>
                </div>

                <button
                  type='submit'
                  className={`w-full border border-black text-black ${
                    isSubmitting
                      ? 'bg-gray-400'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create an account'}
                </button>

                <p className='text-sm font-light text-gray-500'>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='font-medium text-primary-600 hover:underline'
                  >
                    Login here
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

export default Register
