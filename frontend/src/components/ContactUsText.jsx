import React from 'react'

function ContactUsText() {
  return (
    <section className='bg-gray-50'>
      <div className='container px-6 py-12 mx-auto'>
        <div className='text-center'>
          <p className='font-bold text-main'>Reach Us</p>

          <h1 className='mt-2 text-2xl font-semibold text-gray-800 md:text-3xl'>
            We&apos;re Here to Help
          </h1>

          <p className='mt-3 text-gray-600'>
            Feel free to reach out to us for any queries or support.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3'>
          <div className='flex flex-col items-center justify-center text-center'>
            <span className='font-bold text-main rounded-full bg-purple-100/80'>
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
            </span>

            <h2 className='mt-4 text-lg font-medium text-gray-800'>Email</h2>
            <p className='mt-2 text-gray-600'>
              Our team is available to answer your questions.
            </p>
            <p className='mt-bold text-main font-bold'>support@company.com</p>
          </div>

          <div className='flex flex-col items-center justify-center text-center'>
            <span className='font-bold text-main rounded-full bg-purple-100/80'>
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
            </span>

            <h2 className='mt-4 text-lg font-medium text-gray-800'>Office</h2>
            <p className='mt-2 text-gray-600'>
              Visit us at our office during working hours.
            </p>
            <p className='mt-bold text-main font-bold'>
              123 Corporate Blvd, City, Country
            </p>
          </div>

          <div className='flex flex-col items-center justify-center text-center'>
            <span className='font-bold text-main rounded-full bg-purple-100/80'>
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
                  d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'
                />
              </svg>
            </span>

            <h2 className='mt-4 text-lg font-medium text-gray-800'>Phone</h2>
            <p className='mt-2 text-gray-600'>
              Available from 9am to 6pm, Mon-Fri.
            </p>
            <p className='mt-bold text-main font-bold'>+1 (123) 456-7890</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUsText