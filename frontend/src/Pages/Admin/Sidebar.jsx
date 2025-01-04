import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    navigate('/login')
  }

  return (
    <aside className='relative'>
      <div className='sm:hidden'>
        <button className='text-2xl text-gray-700 p-2' onClick={toggleMenu}>
          {isMenuOpen ? (
            <HiChevronLeft className='text-2xl' />
          ) : (
            <HiChevronRight className='text-2xl' />
          )}
        </button>
      </div>

      <div
        className={`sm:hidden absolute top-0 left-0 w-64 h-full bg-base-200 p-5 transition-transform duration-300 z-10 ${
          isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
      >
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
              Verifed Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/not-verified-users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Not Verified Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/disabled-users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Disabled Users
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
          <li>
            <button onClick={handleLogout} className='text-red-500'>
              Logout
            </button>
          </li>
        </ul>
      </div>

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
              Verified & Enabled Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/not-verified-users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Not Verified Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/admin/disabled-users`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Disabled Users
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
          <li>
            <NavLink
              to={`/admin/transactions`}
              className={({ isActive }) =>
                isActive ? 'bg-main' : 'text-gray-700'
              }
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
