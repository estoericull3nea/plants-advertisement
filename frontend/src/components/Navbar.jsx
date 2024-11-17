import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import 'react-modern-drawer/dist/index.css'
import { Icon } from '@iconify/react/dist/iconify.js'
import { FaShoppingCart } from 'react-icons/fa'
import Logo from '../../src/assets/logo/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import { io } from 'socket.io-client'
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
})

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Marketplace', href: '/posts' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
  { title: 'Crops Planning', href: '/crops-planning' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  let isAuthenticated = false

  if (token) {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      isAuthenticated = decoded.exp > currentTime
    } catch (error) {
      console.error('Token decode error:', error)
    }
  }

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
      if (isAuthenticated) {
        fetchCartCount()
      }
    })

    if (isAuthenticated) {
      fetchCartCount()
    }

    return () => {
      socket.off('newUpdateCartCount')
    }
  }, [isAuthenticated, token])

  const handleLogout = () => {
    localStorage.clear('token')
    navigate('/login')
  }

  const listVariants = {
    closed: { x: '100vh' },
    opened: {
      x: 0,
      transition: {
        type: 'tween',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }

  const listItemVariants = {
    closed: { x: -10, opacity: 0 },
    opened: { x: 0, opacity: 1 },
  }

  return (
    <>
      <div className='flex justify-between items-center text-black px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 h-[60px] container'>
        <a
          href='/'
          className='flex items-center justify-center cursor-pointer h-9 w-28'
        >
          <span className='flex items-center gap-2'>
            <img src={Logo} alt='' className='h-10' />
            <h3 className='text-xl font-bold'>FarmMart</h3>
          </span>
        </a>
        <div className='hidden md:flex items-center gap-14'>
          <div className='flex gap-12 md:gap-14'>
            {navItems.map((item, index) => (
              <NavLink
                to={item.href}
                key={index}
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'font-bold text-main' : ''}`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </div>
          <div className='flex items-center gap-4 '>
            {isAuthenticated && (
              <a
                href={`/profile/${localStorage.getItem('userId')}/cart`}
                className='relative flex items-center text-sm text-black'
              >
                <FaShoppingCart className='text-xl' />
                {cartCount > 0 && (
                  <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>
                    {cartCount}
                  </span>
                )}
              </a>
            )}
            {isAuthenticated ? (
              <div className='flex items-center justify-center gap-3'>
                <button
                  onClick={handleLogout}
                  className='py-1 rounded-lg border-main bg-main text-white shadow-lg px-3'
                >
                  Logout
                </button>
                <a
                  href={`/profile/${localStorage.getItem('userId')}/user-info`}
                  className='py-1 rounded-lg border-main bg-main text-white shadow-lg px-3'
                >
                  Profile
                </a>
              </div>
            ) : (
              <a
                href='/register'
                className='bg-gradient-to-l from-[#202752] to-main hover:bg-[#1d20e4] py-2 px-6 rounded-3xl flex items-center text-white'
              >
                Get Started
              </a>
            )}
          </div>
        </div>
        <div className='md:hidden'>
          <button
            className='w-10 h-8 flex flex-col justify-between z-50 relative'
            onClick={() => setOpen((prev) => !prev)}
          >
            {!open ? (
              <Icon icon='charm:menu-hamburger' className='text-2xl' />
            ) : (
              <Icon
                icon='basil:cross-outline'
                className='text-white h-full w-full'
              />
            )}
          </button>
          {open && (
            <motion.div
              variants={listVariants}
              initial='closed'
              animate='opened'
              className='fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center gap-8 text-2xl z-40'
            >
              {navItems.map((item, index) => (
                <motion.div variants={listItemVariants} key={index}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `text-white whitespace-nowrap ${
                        isActive ? 'font-bold' : ''
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div variants={listItemVariants}>
                {isAuthenticated ? (
                  <div className='flex items-center flex-col gap-8 '>
                    <a
                      href={`/profile/${localStorage.getItem(
                        'userId'
                      )}/user-info`}
                      className='py-1 rounded-lg border-main bg-main text-white shadow-lg px-3 '
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className='py-1 rounded-lg border-main bg-main text-white shadow-lg px-3'
                    >
                      Logout
                    </button>
                    <a
                      href='/cart'
                      className='relative text-xl whitespace-nowrap text-white'
                    >
                      <FaShoppingCart className='text-2xl' />
                      {cartCount > 0 && (
                        <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>
                          {cartCount}
                        </span>
                      )}
                    </a>
                  </div>
                ) : (
                  <a
                    href='/register'
                    className='bg-gradient-to-l from-[#202752] to-main hover:bg-[#1d20e4] py-2 px-6 rounded-3xl flex items-center text-white'
                  >
                    Get Started
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
