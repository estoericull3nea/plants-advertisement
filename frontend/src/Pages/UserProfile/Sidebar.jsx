import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { MdOutlineMailOutline } from 'react-icons/md'

const Sidebar = () => {
  const { userId } = useParams()
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
            <NavLink to={`/profile/${userId}/cart`}>Cart</NavLink>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar
