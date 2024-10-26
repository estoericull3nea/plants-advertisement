import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import HowItWords from './components/HowItWords'
import JoinTheFarmMart from './components/JoinTheFarmMart'

const App = () => {
  return (
    <div className=''>
      <Navbar />
      <Hero />
      <HowItWords />
      <JoinTheFarmMart />
      <Footer />
    </div>
  )
}

export default App
