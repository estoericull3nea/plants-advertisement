import React from 'react'
import Sidebar from './Sidebar'
import { useParams, Routes, Route, useNavigate } from 'react-router-dom'
import UserInfo from './UserInfo'

const Profile = () => {
  return (
    <div className='bg-gray-50 '>
      <div className='container flex py-6 gap-3 '>
        <Sidebar />
        <div className='main-content overflow-hidden w-full'>
          <Routes>
            <Route path='/user-info' element={<UserInfo />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Profile
