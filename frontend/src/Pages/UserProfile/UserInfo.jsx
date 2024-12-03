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

        console.log(response.data)
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

    const formData = new FormData()
    formData.append('firstName', e.target.firstName.value)
    formData.append('lastName', e.target.lastName.value)
    formData.append('age', e.target.age.value)
    formData.append('dateOfBirth', e.target.dob.value)
    formData.append('contactNumber', e.target.contactNumber.value)

    const profilePicture = e.target.profilePicture.files[0]
    if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }

    const validId = e.target.validId.files[0]
    if (validId) {
      formData.append('validId', validId)
    }

    console.log(formData)

    try {
      await axios.put(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
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
      <div className='bg-white p-10 shadow-xl rounded-xl flex flex-col gap-4'>
        <div className='skeleton rounded-lg h-10 w-[100px]'></div>
        <div className='grid grid-cols-1 gap-4'>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
          <div className='skeleton rounded-lg h-8 w-full'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div className='bg-white border p-10 shadow-xl rounded-xl'>
      <h2 className='text-3xl font-bold'>My Details</h2>
      <p className='mt-10'>Personal Information</p>
      <div
        id='is-verified'
        className={`text-sm font-bold ${
          userData?.isVerified ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {userData?.isVerified ? 'Verified' : 'Not Verified'}
      </div>
      {!userData?.isVerified ? (
        <p className='text-red-500 font-medium'>
          Tip: Upload Valid ID then wait for verification 24-48 hours.
        </p>
      ) : (
        ''
      )}
      <hr />

      <form className='p-3 space-y-4' onSubmit={handleUpdate}>
        <div className='flex gap-3 items-center'>
          {userData?.profilePictureUrl?.length > 0 && (
            <div className='mt-3 text-center'>
              <label className='block text-sm font-medium mb-2'>
                Profile Picture
              </label>
              <img
                src={
                  userData.profilePictureUrl[
                    userData.profilePictureUrl.length - 1
                  ]
                }
                alt='Profile Picture'
                className='w-50 h-50 rounded-full object-cover'
              />
            </div>
          )}

          {userData?.validIdUrl?.length > 0 && (
            <div className='mt-3 text-center'>
              <label className='block text-sm font-medium mb-2'>Valid ID</label>
              <img
                src={userData.validIdUrl}
                alt='Valid ID'
                className='w-50 h-50 rounded object-cover'
              />
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div className='flex gap-3 items-center'>
          <div className='w-full'>
            <label
              htmlFor='profile-picture'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Profile Picture
            </label>
            <input
              type='file'
              name='profilePicture'
              id='profile-picture'
              accept='image/*'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              disabled={isVisitor}
            />
          </div>

          {/* Valid ID Upload */}
          <div className='w-full'>
            <label
              htmlFor='valid-id'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Upload Valid ID
            </label>
            <input
              type='file'
              name='validId'
              id='valid-id'
              accept='image/*'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              disabled={isVisitor}
            />
            {userData?.validId && (
              <div className='mt-3'>
                <img
                  src={userData.validId}
                  alt='Valid ID'
                  className='w-20 h-20 rounded-full object-cover'
                />
              </div>
            )}
          </div>
        </div>

        {/* first name and last name */}
        <div className='flex gap-3 items-center'>
          <div className='w-full'>
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
              defaultValue={userData?.firstName || ''}
              required
              disabled={isVisitor}
            />
          </div>

          <div className='w-full'>
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
        </div>

        {/* age and dob */}
        <div className='flex gap-3 items-center'>
          <div className='w-full'>
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

          <div className='w-full'>
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
        </div>

        {/* contact number and password */}
        <div className='flex gap-3 items-center'>
          <div className='w-full'>
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
        </div>

        {!isVisitor && (
          <button
            type='submit'
            className='py-1 px-3 rounded-lg border-main bg-main text-white shadow-lg'
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        )}
      </form>
    </div>
  )
}

export default UserInfo
