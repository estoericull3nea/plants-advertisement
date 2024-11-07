import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='min-w-[300px] rounded-xl border shadow-lg bg-gray-50 p-5 z-10'>
      <h1 className='text-2xl font-semibold'>Welcome Admin</h1>

      <ul className='menu rounded-box mt-4'>
        <li className='menu-title'>Menu</li>
        <li>
          <NavLink to={`/profile/user-info`}>My Details</NavLink>
        </li>
        <li>
          <NavLink to={`/all-posts`}>All Posts</NavLink>
        </li>
        <li>
          <NavLink to={`/cart`} className='relative'>
            Cart
          </NavLink>
        </li>
        <li>
          <NavLink to={`/chats`} className='relative'>
            Chats
          </NavLink>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
