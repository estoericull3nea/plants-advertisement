import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import AdminDashboard from './AdminDashboard'
import Users from './Users'
import Products from './Products'
import Chats from './Chats'
import Contact from './Contact'
import Transactions from './Transactions'

const Admin = () => {
  return (
    <div className='bg-gray-50 h-screen'>
      <div className='flex h-full'>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className='flex-1 overflow-auto p-6'>
          <Routes>
            <Route path='/dashboard' element={<AdminDashboard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/products' element={<Products />} />
            <Route path='/chats' element={<Chats />} />
            <Route path='/contacts' element={<Contact />} />
            <Route path='/transactions' element={<Transactions />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Admin
