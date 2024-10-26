import React, { useState } from 'react'
import { motion } from 'framer-motion'
import 'react-modern-drawer/dist/index.css'
import { Icon } from '@iconify/react/dist/iconify.js'
import Logo from '../../src/assets/logo/logo.png'

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const listVariants = {
    closed: { x: '100vh' },
    opened: {
      x: 0,
      transition: {
        type: 'tween',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }
  const listItemVariants = {
    closed: { x: -10, opacity: 0 },
    opened: { x: 0, opacity: 1 },
  }

  return (
    <>
      <div className='flex justify-between items-center text-black px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 h-[60px] container'>
        <a
          href='/'
          className='flex items-center justify-center cursor-pointer h-9 w-28'
        >
          <span className='flex items-center gap-2'>
            <img src={Logo} alt='' className='h-10' />
            <span>Plants Advertisement</span>
          </span>
        </a>
        <div className='hidden md:flex items-center gap-14'>
          <div className='flex gap-12 md:gap-14'>
            {navItems.map((item, index) => (
              <a href={item.href} key={index} className={`text-sm`}>
                {item.title}
              </a>
            ))}
          </div>
          <div>
            <button className='bg-gradient-to-l from-[#202752] to-main hover:bg-[#1d20e4] py-2 px-6 rounded-3xl flex items-center text-white'>
              Get Started
            </button>
          </div>
        </div>
        <div className='md:hidden'>
          <button
            className='w-10 h-8 flex flex-col justify-between z-50 relative'
            onClick={() => setOpen((prev) => !prev)}
          >
            {!open ? (
              <Icon icon='charm:menu-hamburger' className='text-2xl' />
            ) : (
              <Icon
                icon='basil:cross-outline'
                className='text-white h-full w-full'
              />
            )}
          </button>
          {open && (
            <motion.div
              variants={listVariants}
              initial='closed'
              animate='opened'
              className='fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center gap-8 text-2xl z-40'
            >
              {navItems.map((item, index) => (
                <motion.div variants={listItemVariants} key={index}>
                  <a
                    href={item.href}
                    className='text-white whitespace-nowrap'
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </a>
                </motion.div>
              ))}
              <motion.div variants={listItemVariants}>
                <button className='text-xl whitespace-nowrap bg-gradient-to-l from-[#091C82] to-[#182046] hover:bg-[#393baf] text-black font-semibold px-6 py-2 rounded-full text-thin'>
                  Get Started
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
