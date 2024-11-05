import React from 'react'
import { Link } from 'react-router-dom'

export default function JoinTheFarmMart() {
  const token = localStorage.getItem('token')

  return (
    <section className='bg-zinc-900 py-20'>
      <div className='w-full lg:w-9/12 mx-auto flex flex-col items-center gap-8'>
        <p className='text-zinc-100 w-full lg:w-9/12 text-4xl md:text-6xl text-center'>
          Join the FarmMart Community Today!
        </p>
        <p className='text-zinc-400 md:w-7/12 text-center'>
          Connect with others who share your passion for agriculture. Sign up
          now and start exploring.
        </p>
        <div className='space-x-4 flex items-center'>
          {!token ? (
            <Link
              to='/register'
              className='py-1 px-3 rounded-lg border-main bg-main text-white shadow-lg'
            >
              Sign Up
            </Link>
          ) : (
            <Link
              to='/posts'
              className='py-1 px-3 rounded-lg border-main bg-main text-white shadow-lg'
            >
              View Posts
            </Link>
          )}
          <Link
            to='/contact'
            className='py-1 px-3 rounded-lg border-main bg-transparent border  text-white shadow-lg'
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}

function IconArrowRightShort(props) {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 16 16'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z'
      />
    </svg>
  )
}
