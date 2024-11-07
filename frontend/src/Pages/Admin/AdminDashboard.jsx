import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/count-users`
        )
        setUserCount(response.data.count)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch user count')
        setLoading(false)
      }
    }

    fetchUserCount()
  }, [])

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-semibold text-gray-800'>Admin Dashboard</h1>

      {/* User count section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>Total Users</h2>

        {loading ? (
          // Skeleton loader while data is loading
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          // Display error message if there's an issue
          <div className='text-red-500'>{error}</div>
        ) : (
          // Display user count after data is fetched
          <div className='text-4xl font-semibold text-main'>{userCount}</div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
