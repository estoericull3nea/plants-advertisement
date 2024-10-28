import React from 'react'
import Sidebar from './Sidebar'
import { useParams, Routes, Route, useNavigate } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='bg-gray-50 '>
      <div className='container flex py-6 gap-3 '>
        <Sidebar />
        <div className='main-content overflow-hidden w-full'>
          <Routes>
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Profile
