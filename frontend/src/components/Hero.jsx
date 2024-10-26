'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
const heroBanner = [
  {
    head: 'Creative Solutions',
    title: 'Empowering Your Business Vision',
    description:
      'We provide the expertise and innovative solutions to help you realize your business aspirations.',
    image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1721837719/download_rdxjld.webp',
  },
  {
    head: 'Innovative Agency',
    title: 'Unlock Your Business Potential',
    description:
      'Our team is dedicated to turning your dreams into reality through cutting-edge solutions and expert guidance.',
    image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1721837648/features-img-1_msjovk.webp',
  },
  {
    head: 'Expert Team',
    title: 'Achieve Your Business Goals',
    description:
      'Partner with us to leverage innovative strategies and expert knowledge to reach your business objectives.',
    image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1721837633/hero-slider-1-img_iopzxw.webp',
  },
  {
    head: 'Future-Driven',
    title: 'Transform Your Business',
    description:
      'We offer the innovative solutions and expertise needed to help you achieve your business dreams and goals.',
    image:
      'https://res.cloudinary.com/dpb8r7bqq/image/upload/v1721837633/hero-slider-img-3_klmsdx.webp',
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
                className='object-cover h-full w-full'
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
