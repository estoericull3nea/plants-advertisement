import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './Pages/Home'
import Register from './Pages/Register'

const App = () => {
  return (
    <div className=''>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
