import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Profile from './Pages/UserProfile/Profile'

import PrivateRoute from './components/PrivateRoute'
import ProtectedRoute from './components/ProtectedRoute'
import PostProduct from './Pages/PostProduct'

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

          <Route
            path='/register'
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/login'
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile/:userId/*'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path='/posts'
            element={
              <PrivateRoute>
                <PostProduct />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
