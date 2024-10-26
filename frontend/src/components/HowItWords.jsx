import React from 'react'

const HowItWords = () => {
  const service = [
    {
      title: 'Sign Up',
      description: 'Create your account to get started.',
    },
    {
      title: 'Browse Listings',
      description: 'Explore products and services from sellers.',
    },
    {
      title: 'Post Products',
      description: 'Sell your agricultural products to interested buyers.',
    },
    {
      title: 'Chat',
      description:
        'Communicate directly with buyers and sellers to negotiate deals.',
    },
  ]

  return (
    <div className='grid grid-cols-1 items-center bg-fixed bg-top bg-cover bg-blend-multiply bg-main bg-opacity-60 bg-no-repeat px-4 sm:px-6 md:px-10 lg:px-28 xl:px-36 py-24 h-auto text-black'>
      <div>
        <p className='text-center text-xl mt-0 font-bold'>How It Works</p>
      </div>
      <div>
        <section className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-4 2xl:px-24 md:p-6'>
          {service?.map((e, index) => (
            <div className='w-full p-4 rounded-2xl border' key={index}>
              <div>
                <div className='text-md font-bold text-slate-200'>
                  {e.title}
                </div>
                <p className='text-sm text-black'>{e.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default HowItWords
