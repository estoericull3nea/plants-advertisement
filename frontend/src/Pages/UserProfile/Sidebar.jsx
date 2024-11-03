import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { MdOutlineMailOutline } from 'react-icons/md'
import { jwtDecode } from 'jwt-decode'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

const Sidebar = ({ isVisitor }) => {
  console.log(isVisitor)
  const { userId } = useParams()
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const fetchCartCount = async () => {
    try {
      const decoded = jwtDecode(token)
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/carts/count/${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch cart count')
      const data = await response.json()
      setCartCount(data.count)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch user data')
      const data = await response.json()
      setUser({ name: data.name, email: data.email })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    socket.on('newUpdateCartCount', fetchCartCount)
    fetchCartCount()
    fetchUserData()

    return () => {
      socket.off('newUpdateCartCount', fetchCartCount)
    }
  }, [token, userId])

  return (
    <aside className='min-w-[300px] rounded-xl sticky top-0 bg-gray-50'>
      <div className='pl-5 pt-5'>
        <h1 className='text-2xl font-semibold'>My Account</h1>
        <h3 className='flex items-center text-sm gap-1 text-gray-500'>
          <MdOutlineMailOutline className='text-gray-400' />
          {loading ? <div className='skeleton h-4 w-28'></div> : user.email}
        </h3>
        <h4 className='text-lg font-medium'>
          {loading ? <div className='skeleton h-4 w-40'></div> : user.name}
        </h4>
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
  )
}

export default Sidebar
