import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom' // Import useNavigate for redirection
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi' // Import arrow icons

const Sidebar = () => {
  // State to manage the mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigate = useNavigate() // Initialize useNavigate hook to redirect

  // Toggle menu visibility for mobile
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    navigate('/login')
  }

  return (
    <aside className='relative'>
      {/* Mobile Icon (Hamburger Menu) */}
      <div className='sm:hidden'>
        <button className='text-2xl text-gray-700 p-2' onClick={toggleMenu}>
          {/* Show left arrow when the menu is open, right arrow when closed */}
          {isMenuOpen ? (
            <HiChevronLeft className='text-2xl' />
          ) : (
            <HiChevronRight className='text-2xl' />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`sm:hidden absolute top-0 left-0 w-64 h-full bg-base-200 p-5 transition-transform duration-300 z-10 ${
          isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-2xl text-gray-700'
          onClick={toggleMenu}
        >
          <HiChevronLeft />
        </button>

        <ul className='menu'>
          <li>
            <NavLink
              to={`/admin/dashboard`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/products`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/chats`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Chats
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/contacts`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Contacts
            </NavLink>
          </li>
          {/* Logout Button for Mobile */}
          <li>
            <button onClick={handleLogout} className='text-red-500'>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className='hidden sm:block p-5'>
        <h1 className='text-2xl font-semibold'>Welcome Admin</h1>

        <ul className='menu rounded-box mt-4'>
          <li>
            <NavLink
              to={`/admin/dashboard`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/products`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/chats`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Chats
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/contacts`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Contacts
            </NavLink>
          </li>
          {/* Logout Button for Desktop */}
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
