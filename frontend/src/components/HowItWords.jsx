import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      title: 'Sign Up',
      description:
        "Create an account to start exploring and purchasing agricultural products from trusted sellers. It's quick and easy!",
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4v16m8-8H4'
          />
        </svg>
      ),
      bgColor: 'bg-blue-100/80',
    },
    {
      title: 'Browse Products',
      description:
        'Explore a wide range of agricultural products from trusted sellers.',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
          />
        </svg>
      ),
      bgColor: 'bg-purple-100/80',
    },
    {
      title: 'Post Products',
      description:
        'Sell your agricultural products directly on the platform. Reach potential buyers easily and manage your listings.',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 12l2 2 4-4 5 5 7-7'
          />
        </svg>
      ),
      bgColor: 'bg-yellow-100/80',
    },
    {
      title: 'View Product Details',
      description:
        'Get detailed product information to make an informed decision before purchase.',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
          />
        </svg>
      ),
      bgColor: 'bg-green-100/80',
    },
    {
      title: 'Chat with Users',
      description:
        'Directly message sellers to ask questions, negotiate prices, or clarify details before making a purchase.',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8 9h8M8 13h8'
          />
        </svg>
      ),
      bgColor: 'bg-blue-100/80',
    },
    {
      title: 'Checkout',
      description:
        'Finalize your purchase securely. Review your cart, enter shipping details, and make a payment.',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21 12c0 4.285-4.3 7.5-9.5 7.5S2 16.285 2 12 6.3 4.5 11.5 4.5 21 7.715 21 12z'
          />
        </svg>
      ),
      bgColor: 'bg-purple-100/80',
    },
  ]

  return (
    <div className='my-12 container'>
      <h2 className='text-center text-xl font-semibold text-main'>
        How It Works
      </h2>
      <p className='mt-2 text-center text-gray-600'>
        Our platform offers a seamless and user-friendly experience for buyers
        and sellers in the agricultural industry.
      </p>
      <div className='grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3 max-w-[900px] mx-auto'>
        {steps.map((step, index) => (
          <div
            className='flex flex-col items-center justify-center text-center'
            key={index}
          >
            <span
              className={`font-bold text-main rounded-full ${step.bgColor}`}
            >
              {step.icon}
            </span>
            <h3 className='mt-4 text-lg font-medium text-gray-800'>
              {step.title}
            </h3>
            <p className='mt-2 text-gray-600'>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
