import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const UserInfo = ({ isVisitor }) => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`
        )
        setUserData(response.data)
      } catch (err) {
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setError(null)
    try {
      const updateData = {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        age: e.target.age.value,
        dateOfBirth: e.target.dob.value,
        contactNumber: e.target.contactNumber.value,
        password: e.target.password.value,
      }

      await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`,
        updateData
      )
      toast.success('User updated successfully!')

      // Refetch user data after updating
      const response = await axios.get(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`
      )
      setUserData(response.data)
    } catch (err) {
      toast.error('Failed to update user data')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className='flex w-full justify-center items-center h-screen'>
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
      <form className='p-3 space-y-4' onSubmit={handleUpdate}>
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
            defaultValue={userData?.firstName || ''}
            required
            disabled={isVisitor}
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
            defaultValue={userData?.lastName || ''}
            required
            disabled={isVisitor}
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
            defaultValue={userData?.age || ''}
            required
            disabled={isVisitor}
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
            defaultValue={
              userData?.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
            }
            required
            disabled={isVisitor}
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
            defaultValue={userData?.contactNumber || ''}
            required
            disabled={isVisitor}
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
          />
          <p className='text-sm text-gray-500 mt-1'>
            If you don't want to change your password, leave this field empty.
          </p>
        </div>

        {!isVisitor && (
          <button
            type='submit'
            className='w-full text-white bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update User'}
          </button>
        )}
      </form>
    </div>
  )
}

export default UserInfo
