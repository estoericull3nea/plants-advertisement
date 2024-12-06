import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
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
import ProductDetail from './components/ProductDetail'
import Chatbox from './Pages/Chatbox'
import ContactUsForm from './components/ContactUsForm'
import About from './Pages/About'
import Admin from './Pages/Admin/Admin'
import CropsPlanning from './Pages/CropsPlanning'
import Checkout from './Pages/Checkout'

const Layout = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}

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
          path='/products/:id'
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path='/chats'
          element={
            <PrivateRoute>
              <Chatbox />
            </PrivateRoute>
          }
        />
        <Route path='/contact' element={<ContactUsForm />} />
        <Route path='/about' element={<About />} />
        <Route path='/crops-planning' element={<CropsPlanning />} />
        <Route path='/checkout' element={<Checkout />} />

        {/* Admin Route */}
        <Route path='/admin/*' element={<Admin />} />

        <Route
          path='/posts'
          element={
            <PrivateRoute>
              <PostProduct />
            </PrivateRoute>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

const App = () => {
  useEffect(() => {
    document.title = 'FarmMart'
  }, [])

  return (
    <div className=''>
      <Toaster
        position='top-center'
        reverseOrder={false}
        containerClassName='text-xs'
      />
      <Router>
        <Layout />
      </Router>
    </div>
  )
}

export default App
