'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
const heroBanner = [
  {
    head: 'Smart Shopping Innovations',
    title: 'Shop Smart, Connect Instantly',
    description:
      'We provide the expertise and innovative solutions to help you realize your business aspirations.',
    image:
      'https://images.squarespace-cdn.com/content/v1/5e1a000279b1df2af2fd8a16/1689972295048-2FV7XQHZGZN8FH6WZB15/Chicken-Grazing-Vernon-Family-Farm.jpg',
  },
  {
    head: 'Community-Driven Marketplace',
    title: 'Your Marketplace, Your Community',
    description:
      'Our team is dedicated to turning your dreams into reality through cutting-edge solutions and expert guidance.',
    image:
      'https://cdn.britannica.com/56/155656-050-EF76EB04/chickens-poultry-farm.jpg',
  },
  {
    head: 'Engaging Customer Experiences',
    title: 'Where Shopping Meets Conversation',
    description:
      'Partner with us to leverage innovative strategies and expert knowledge to reach your business objectives.',
    image:
      'https://images.pexels.com/photos/195226/pexels-photo-195226.jpeg?cs=srgb&dl=pexels-aburrell-195226.jpg&fm=jpg',
  },
  {
    head: 'Seamless Shopping Solutions',
    title: 'Discover, Chat, and Shop with Ease',
    description:
      'We offer the innovative solutions and expertise needed to help you achieve your business dreams and goals.',
    image:
      'https://images.coolwallpapers.me/picsup/3017960-account_accountant_accounting_analysis_apple_banking_bill_bookkeeper_budget_business_businessman_businesswoman_calculation_cash_cell_computer_corporate_desk_document_economy_finance_financial_han.jpg',
  },
]

function Hero() {
  return (
    <div className='h-[calc(100vh-60px)]'>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
        }}
        className='h-full text-white'
      >
        {heroBanner?.map((item, index) => (
          <SwiperSlide className='bg-black relative text-white' key={index}>
            <div className=' w-full h-full'>
              <img
                src={item.image || ''}
                className='object-cover h-full w-full brightness-75'
              />
            </div>
            <div className='absolute top-0 left-10 w-[80%] m-auto flex justify-start items-center h-full '>
              <div className='w-full sm:w-[60%] md:w-[70%] lg:w-[60%] flex flex-col gap-4'>
                <span className='px-4 py-2 bg-slate-100 bg-opacity-30 w-fit rounded-md text-sm md:text-base'>
                  {item.head}
                </span>
                <h2 className='text-4xl sm:text-5xl lg:text-6xl xl:text-6xl'>
                  {item.title}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default Hero
