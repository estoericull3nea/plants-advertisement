import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { MdOutlineMailOutline } from 'react-icons/md'

const Sidebar = () => {
  return (
    <div>
      <aside className='min-w-[300px] shadow-xl rounded-xl bg-white sticky top-0'>
        <div className='pl-5 pt-5'>
          <h1 className='text-2xl font-semibold'>Ericson Palisoc</h1>
          <h3 className='flex items-center text-sm gap-1 text-gray-500'>
            qwe@qwe.com
          </h3>
        </div>

        <ul className='menu rounded-box'>
          <li className='menu-title'>Menu</li>
          <li>
            <NavLink>Dashboard</NavLink>
          </li>
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar
