import React from 'react'
import HowItWorks from '../components/HowItWords'
import ContactUsText from '../components/ContactUsText'

const About = () => {
  return (
    <div className='container'>
      <section className=''>
        <div className='container grid gap-20 my-10 py-10'>
          <div className='text-center max-w-[650px] mx-auto space-y-10'>
            <p className='font-bold text-main'>About Us</p>
            <h1 className='mt-2 text-2xl font-semibold text-gray-800 md:text-3xl'>
              Empowering the Agricultural Community Through Technology
            </h1>
            <p className='mt-3 text-gray-600'>
              We are a digital marketplace dedicated to connecting farmers,
              suppliers, and buyers, making agricultural products more
              accessible and empowering businesses to thrive.
            </p>
          </div>

          <HowItWorks />

          <div className='mt-12  max-w-[650px] mx-auto'>
            <h2 className='text-center text-xl font-semibold text-gray-800'>
              Our Mission
            </h2>
            <p className='mt-4 text-center text-gray-600'>
              Our mission is to provide a reliable and sustainable digital
              marketplace that brings together agricultural buyers and sellers
              to foster growth in the farming community. We aim to promote
              sustainability, access to high-quality products, and fair trade.
            </p>
          </div>

          <div className='mt-12 max-w-[1200px] mx-auto'>
            <h2 className='text-center text-xl font-semibold text-gray-800'>
              Our Core Values
            </h2>
            <div className='grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-4'>
              {/* Value 1: Trust */}
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
                      d='M21 6L9 17l-5-5'
                    />
                  </svg>
                </span>
                <h3 className='mt-4 text-lg font-medium text-gray-800'>
                  Trust
                </h3>
                <p className='mt-2 text-gray-600'>
                  We prioritize trust and transparency, ensuring safe
                  transactions for everyone.
                </p>
              </div>

              {/* Value 2: Quality */}
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
                      d='M3 12l2 2l4-4m5 5l2 2l4-4m5 5l2 2m0-14l-2-2'
                    />
                  </svg>
                </span>
                <h3 className='mt-4 text-lg font-medium text-gray-800'>
                  Quality
                </h3>
                <p className='mt-2 text-gray-600'>
                  We focus on delivering top-quality agricultural products and
                  services.
                </p>
              </div>

              {/* Value 3: Community */}
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
                      d='M12 12l4-4l4 4m-4 4l4 4l-4 4m-8-4l-4-4l4-4'
                    />
                  </svg>
                </span>
                <h3 className='mt-4 text-lg font-medium text-gray-800'>
                  Community
                </h3>
                <p className='mt-2 text-gray-600'>
                  We support local farmers and foster a community of
                  collaboration and trust.
                </p>
              </div>

              {/* Value 4: Sustainability */}
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
                      d='M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z'
                    />
                  </svg>
                </span>
                <h3 className='mt-4 text-lg font-medium text-gray-800'>
                  Sustainability
                </h3>
                <p className='mt-2 text-gray-600'>
                  We are committed to sustainable practices that protect the
                  environment and ensure future generations can thrive.
                </p>
              </div>
            </div>
          </div>

          <ContactUsText />
        </div>
      </section>
    </div>
  )
}

export default About
