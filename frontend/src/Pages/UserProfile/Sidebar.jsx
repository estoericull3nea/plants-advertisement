import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { MdOutlineMailOutline } from 'react-icons/md'
import { jwtDecode } from 'jwt-decode'

import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')

const Sidebar = () => {
  const { userId } = useParams()

  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchCartCount = async () => {
    const decoded = jwtDecode(token)
    const response = await fetch(
      `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/count/${decoded.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await response.json()
    setCartCount(data.count)
  }

  useEffect(() => {
    socket.on('newUpdateCartCount', (data) => {
      fetchCartCount()
    })

    fetchCartCount()

    return () => {
      socket.off('newUpdateCartCount')
    }
  }, [token])

  return (
    <div>
      <aside className='min-w-[300px]  rounded-xl sticky top-0 bg-gray-50'>
        <div className='pl-5 pt-5'>
          <h1 className='text-2xl font-semibold'>My Account</h1>
          <h3 className='flex items-center text-sm gap-1 text-gray-500'>
            qwe@qwe.com
          </h3>
        </div>

        <ul className='menu rounded-box'>
          <li className='menu-title'>Menu</li>
          <li>
            <NavLink to={`/profile/${userId}/user-info`}>My Details</NavLink>
            <NavLink to={`/profile/${userId}/all-posts`}>All Posts</NavLink>
            <NavLink to={`/profile/${userId}/cart`} className='relative'>
              Cart
              {cartCount > 0 && (
                <span className='absolute top-[-8px] right-[-10px] badge badge-primary bg-red-500 border-none'>
                  {cartCount}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar
