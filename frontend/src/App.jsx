import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'

const App = () => {
  return (
    <div className=''>
      <Toaster
        position='top-center'
        reverseOrder={false}
        containerClassName='text-xs'
      />
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
