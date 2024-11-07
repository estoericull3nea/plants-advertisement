import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='min-w-[300px] rounded-xl border shadow-lg bg-gray-50 p-5 z-10'>
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

        {/* User Management Section */}
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

        {/* Product Management Section */}
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
      </ul>
    </aside>
  )
}

export default Sidebar
