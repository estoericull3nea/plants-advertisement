import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const UserInfo = () => {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`
        )
        setUserData(response.data)
      } catch (err) {
        setError('Error fetching user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Create an object with form data
    const updatedUserData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      age: e.target.age.value,
      dateOfBirth: e.target.dob.value,
      contactNumber: e.target.contactNumber.value,
      password: e.target.password.value,
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`,
        updatedUserData
      )
      alert('User updated successfully!')
    } catch (err) {
      setError('Error updating user data')
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div className='bg-white p-10 shadow-xl rounded-xl'>
      <h2 className='text-3xl font-bold'>My Details</h2>
      <p className='mt-10'>Personal Information</p>
      <hr />
      <form onSubmit={handleSubmit} className='p-3 space-y-4'>
        <div>
          <label
            htmlFor='first-name'
            className='block mb-2 text-sm font-medium text-gray-900 mt-5'
          >
            First Name
          </label>
          <input
            type='text'
            name='firstName'
            id='first-name'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            placeholder='John'
            defaultValue={userData.firstName}
            required
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
            defaultValue={userData.lastName}
            required
          />
        </div>

        <div>
          <label
            htmlFor='age'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Age
          </label>
          <input
            type='text'
            inputMode='numeric'
            name='age'
            pattern='[0-9]*'
            id='age'
            min='1'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            placeholder='25'
            defaultValue={userData.age}
            required
          />
        </div>

        <div>
          <label
            htmlFor='dob'
            className='block mb-2 text-sm font-medium text-gray-900'
          >
            Date of Birth
          </label>
          <input
            type='date'
            name='dob'
            id='dob'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            defaultValue={userData.dateOfBirth.split('T')[0]} // Format date to match input
            required
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
            type='text'
            name='contactNumber'
            id='contact-number'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            placeholder='123-456-7890'
            defaultValue={userData.contactNumber}
            required
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
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            placeholder='••••••••'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
        >
          Update User
        </button>
      </form>
    </div>
  )
}

export default UserInfo
