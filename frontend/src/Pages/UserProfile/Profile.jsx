import React from 'react'
import Sidebar from './Sidebar'
import { useParams, Routes, Route } from 'react-router-dom'
import UserInfo from './UserInfo'
import ProductTable from './ProductTable'
import Cart from './Cart'

const Profile = () => {
  const { userId } = useParams() // Get the userId from the URL
  const currentUserId = userId // Replace with your logic to get the logged-in user's ID
  const isVisitor = currentUserId !== localStorage.getItem('userId') // Determine if the user is a visitor

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='container flex flex-col lg:flex-row py-6 gap-3'>
        <Sidebar isVisitor={isVisitor} className='w-full md:w-1/4' />
        <div className='main-content overflow-hidden w-full '>
          <Routes>
            <Route
              path='/user-info'
              element={<UserInfo userId={userId} isVisitor={isVisitor} />}
            />
            <Route
              path='/all-posts'
              element={<ProductTable isVisitor={isVisitor} />}
            />
            <Route path='/cart' element={<Cart isVisitor={isVisitor} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Profile
