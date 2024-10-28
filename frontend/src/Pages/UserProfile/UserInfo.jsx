import React from 'react'

const UserInfo = () => {
  return (
    <div className='bg-white p-10 shadow-xl rounded-xl'>
      <h2 className='text-3xl font-bold'>My Details</h2>
      <p className='mt-10'>Personal Information</p>
      <hr />
      <div className='p-3 space-y-4'>
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
      </div>
    </div>
  )
}

export default UserInfo
