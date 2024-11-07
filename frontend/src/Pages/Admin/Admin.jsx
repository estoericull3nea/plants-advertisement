import React, { useEffect, useState } from 'react'
import { useParams, Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import AdminDashboard from './AdminDashboard'

const Admin = () => {
  return (
    <div className='bg-gray-50 '>
      <div className='container flex py-6 gap-3 '>
        <Sidebar />
        <div className='main-content overflow-hidden w-full'>
          <Routes>
            <Route path='/dashboard' element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Admin
