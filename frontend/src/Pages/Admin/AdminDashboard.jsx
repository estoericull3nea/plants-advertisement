import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [userCountData, setUserCountData] = useState({
    userCount: null,
    verifiedCount: null,
    nonVerifiedCount: null,
  })
  const [productCountData, setProductCountData] = useState({
    productCount: null,
    availableCount: null,
    unavailableCount: null,
  })
  const [chatCountData, setChatCountData] = useState({
    totalChats: null,
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch user count data
        const userCountResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/count-users`
        )
        setUserCountData({
          userCount: userCountResponse.data.userCount,
          verifiedCount: userCountResponse.data.verifiedCount,
          nonVerifiedCount: userCountResponse.data.nonVerifiedCount,
        })

        // Fetch product count data
        const productCountResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/count-products`
        )
        setProductCountData({
          productCount: productCountResponse.data.productCount,
          availableCount: productCountResponse.data.availableCount,
          unavailableCount: productCountResponse.data.unavailableCount,
        })

        // Fetch chat count data (totalChats)
        const chatCountResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/count-chats`
        )
        setChatCountData({
          totalChats: chatCountResponse.data.totalChats,
        })

        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-semibold text-gray-800'>Admin Dashboard</h1>

      {/* User Count Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>Total Users</h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {userCountData.userCount}
          </div>
        )}
      </div>

      {/* Verified Users Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Verified Users
        </h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {userCountData.verifiedCount}
          </div>
        )}
      </div>

      {/* Non-Verified Users Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Non-Verified Users
        </h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {userCountData.nonVerifiedCount}
          </div>
        )}
      </div>

      {/* Total Products Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Total Products
        </h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {productCountData.productCount}
          </div>
        )}
      </div>

      {/* Available Products Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Available Products
        </h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {productCountData.availableCount}
          </div>
        )}
      </div>

      {/* Unavailable Products Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Unavailable Products
        </h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {productCountData.unavailableCount}
          </div>
        )}
      </div>

      {/* Total Chats Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>Total Chats</h2>
        {loading ? (
          <div className='flex w-52 flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='text-4xl font-semibold text-main'>
            {chatCountData.totalChats}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
