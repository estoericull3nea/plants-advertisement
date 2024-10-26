import React from 'react'

const Footer = () => {
  const footerNavs = [
    {
      label: 'Explore',
      items: [
        { href: 'javascript:void(0)', name: 'Crops' },
        { href: 'javascript:void(0)', name: 'Livestock' },
        { href: 'javascript:void(0)', name: 'Fisheries' },
      ],
    },
    {
      label: 'Quick Links',
      items: [
        { href: 'javascript:void(0)', name: 'Home' },
        { href: 'javascript:void(0)', name: 'Posts' },
        { href: 'javascript:void(0)', name: 'About' },
        { href: 'javascript:void(0)', name: 'Contact' },
      ],
    },
    {
      label: 'Connect',
      items: [
        { href: 'javascript:void(0)', name: 'Instagram' },
        { href: 'javascript:void(0)', name: 'Facebook' },
        { href: 'javascript:void(0)', name: 'Get in Touch' },
      ],
    },
    {
      label: 'Legal',
      items: [
        { href: 'javascript:void(0)', name: 'Terms Of Service' },
        { href: 'javascript:void(0)', name: 'Privacy Policy' },
        { href: 'javascript:void(0)', name: 'Cookies Policy' },
        { href: 'javascript:void(0)', name: 'FAQs' },
      ],
    },
  ]

  return (
    <footer className='pt-10 container'>
      <div className='max-w-screen-xl mx-auto px-4 md:px-8'>
        <div className='flex-1 mt-16 space-y-6 justify-between sm:flex md:space-y-0'>
          {footerNavs.map((nav, idx) => (
            <ul className='space-y-4 text-gray-600' key={idx}>
              <h4 className='text-gray-800 font-semibold sm:pb-2'>
                {nav.label}
              </h4>
              {nav.items.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className='hover:text-gray-800 duration-150'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className='mt-10 py-10 border-t items-center justify-between sm:flex'>
          <p className='text-gray-600'>
            © 2024 Plants Advertisement | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
