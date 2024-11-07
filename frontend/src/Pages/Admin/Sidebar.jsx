import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='min-w-[300px] rounded-xl border shadow-lg bg-gray-50 p-5 z-10'>
      <h1 className='text-2xl font-semibold'>Welcome Admin</h1>

      <ul className='menu rounded-box mt-4'>
        {/* Dashboard Section */}
        <li className='menu-title'>Dashboard</li>
        <li>
          <NavLink
            to={`/admin/dashboard`}
            className={({ isActive }) =>
              isActive ? 'bg-main' : 'text-gray-700'
            }
          >
            Dashboard Overview
          </NavLink>
        </li>

        {/* User Management Section */}
        <li className='menu-title'>User Management</li>
        <li>
          <NavLink
            to={`/admin/users`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            All Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/user-roles`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            User Roles & Permissions
          </NavLink>
        </li>

        {/* Product Management Section */}
        <li className='menu-title'>Product Management</li>
        <li>
          <NavLink
            to={`/admin/products`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            All Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/product-categories`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/product-listing-approval`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Product Approval
          </NavLink>
        </li>

        {/* Order Management Section */}
        <li className='menu-title'>Order & Transaction Management</li>
        <li>
          <NavLink
            to={`/admin/orders`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Orders List
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/order-details`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Order Details
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/payments`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Payment Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/refunds`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Refunds & Disputes
          </NavLink>
        </li>

        {/* Reports & Analytics Section */}
        <li className='menu-title'>Reports & Analytics</li>
        <li>
          <NavLink
            to={`/admin/sales-reports`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Sales Analytics
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/user-engagement`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            User Engagement
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/product-performance`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Product Performance
          </NavLink>
        </li>

        {/* Content Management Section */}
        <li className='menu-title'>Content Management</li>
        <li>
          <NavLink
            to={`/admin/content-management`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            How It Works
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/faq`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            FAQ Management
          </NavLink>
        </li>

        {/* Moderation & Support Section */}
        <li className='menu-title'>Moderation & Support</li>
        <li>
          <NavLink
            to={`/admin/reports`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Report Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/content-moderation`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Content Moderation
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/customer-support`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Customer Support
          </NavLink>
        </li>

        {/* Settings Section */}
        <li className='menu-title'>Settings</li>
        <li>
          <NavLink
            to={`/admin/user-permissions`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            User Permissions
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/site-branding`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Branding & Theme
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/admin/security`}
            className={({ isActive }) =>
              isActive ? 'text-main' : 'text-gray-700'
            }
          >
            Security & Privacy
          </NavLink>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
