import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RegistrationStats from '../../components/RegistrationStats'
import ProductStats from '../../components/ProductStats'
import ChatStats from '../../components/ChatStats'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([]) // For storing recent users
  const [recentProducts, setRecentProducts] = useState([]) // For storing recent products
  const [latestChats, setLatestChats] = useState([]) // For storing the latest 5 chats

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

        const recentUsersResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/top-5-recent-users`
        )
        setRecentUsers(recentUsersResponse.data)

        const recentProductsResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/top-5-recent-products`
        )
        setRecentProducts(recentProductsResponse.data)

        // Fetch latest chats (latest chats)
        const latestChatsResponse = await axios.get(
          `${import.meta.env.VITE_DEV_BACKEND_URL}/datas/latest-chats`
        )
        setLatestChats(latestChatsResponse.data)

        setLoading(false)
      } catch (err) {
        setError('Failed to fetch data')
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return (
    <div className='py-6 space-y-6'>
      <h1 className='text-3xl font-semibold text-gray-800'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3'>
        {/* User Count Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
          <h2 className='text-xl font-medium text-gray-700 mb-4'>
            Total Users
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {userCountData.userCount}
            </div>
          )}
        </div>

        {/* Verified Users Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {userCountData.verifiedCount}
            </div>
          )}
        </div>

        {/* Non-Verified Users Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {userCountData.nonVerifiedCount}
            </div>
          )}
        </div>

        {/* Total Products Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {productCountData.productCount}
            </div>
          )}
        </div>

        {/* Available Products Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {productCountData.availableCount}
            </div>
          )}
        </div>

        {/* Unavailable Products Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {productCountData.unavailableCount}
            </div>
          )}
        </div>

        {/* Total Chats Section */}
        <div className='card shadow-lg bg-base-100 p-6 rounded-xl w-full sm:max-w-xs'>
          <h2 className='text-xl font-medium text-gray-700 mb-4'>
            Total Chats
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
            <div className='text-2xl sm:text-3xl md:text-4xl font-semibold text-main'>
              {chatCountData.totalChats}
            </div>
          )}
        </div>
      </div>

      <RegistrationStats />
      <ProductStats />
      <ChatStats />

      {/* Recent Users Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl col-span-1 md:col-span-2 xl:col-span-1'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>Recent Users</h2>
        {loading ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='overflow-x-auto sm:w-full'>
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='border-b'>
                  {/* <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Profile
                  </th> */}
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    First Name
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Last Name
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Email
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Contact Number
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Municipality
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Barangay
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Date of Birth
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Age
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Date and Time Registered
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id} className='border-b'>
                    {/* <td className='px-4 py-2'>
                      <img
                        src={user.picture || 'default-avatar.jpg'} // Fallback if no profile picture
                        alt={`${user.firstName} ${user.lastName}`}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    </td> */}
                    <td className='px-4 py-2'>{user.firstName}</td>
                    <td className='px-4 py-2'>{user.lastName}</td>
                    <td className='px-4 py-2'>{user.email}</td>
                    <td className='px-4 py-2'>{user.contactNumber}</td>
                    <td className='px-4 py-2'>{user.municipality}</td>
                    <td className='px-4 py-2'>{user.barangay}</td>
                    <td className='px-4 py-2'>
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className='px-4 py-2'>{user.age || 'N/A'}</td>
                    <td className='px-4 py-2'>
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className='px-4 py-2'>
                      {user.isVerified ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Products Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl col-span-1 md:col-span-2 xl:col-span-1'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>
          Recent Products
        </h2>
        {loading ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='border-b'>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Product Title
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Category
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Price
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Stock
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Availability
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product._id} className='border-b'>
                    <td className='px-4 py-2'>{product.title}</td>
                    <td className='px-4 py-2'>{product.category}</td>
                    <td className='px-4 py-2'>{product.price}</td>
                    <td className='px-4 py-2'>{product.stock}</td>
                    <td className='px-4 py-2'>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </td>
                    <td className='px-4 py-2'>
                      {new Date(product.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Chats Section */}
      <div className='card shadow-lg bg-base-100 p-6 rounded-xl col-span-1 md:col-span-2 xl:col-span-1'>
        <h2 className='text-xl font-medium text-gray-700 mb-4'>Recent Chats</h2>
        {loading ? (
          <div className='flex w-full flex-col gap-4'>
            <div className='skeleton h-32 w-full'></div>
            <div className='skeleton h-4 w-28'></div>
            <div className='skeleton h-4 w-full'></div>
            <div className='skeleton h-4 w-full'></div>
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full table-auto'>
              <thead>
                <tr className='border-b'>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Sender
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Receiver
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Message
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Product Preview
                  </th>
                  <th className='px-4 py-2 text-left text-sm font-semibold text-gray-600'>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestChats.map((chat) => (
                  <tr key={chat._id} className='border-b'>
                    <td className='px-4 py-2'>
                      {chat.sender[0]?.firstName +
                        ' ' +
                        chat.sender[0].lastName || 'Unknown'}
                    </td>
                    <td className='px-4 py-2'>
                      {chat.receiver[0]?.firstName +
                        ' ' +
                        chat.receiver[0].lastName || 'Unknown'}
                    </td>
                    <td className='px-4 py-2'>{chat.text || 'No message'}</td>
                    <td className='px-4 py-2'>
                      {chat.productPreview ? (
                        <>
                          <strong>{chat.productPreview.title}</strong>
                          <p>{chat.productPreview.description}</p>
                        </>
                      ) : (
                        'No product preview'
                      )}
                    </td>
                    <td className='px-4 py-2'>
                      {new Date(chat.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
