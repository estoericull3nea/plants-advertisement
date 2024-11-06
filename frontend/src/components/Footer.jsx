import React from 'react'

const Footer = () => {
  const footerNavs = [
    {
      label: 'Explore',
      items: [
        { href: 'http://localhost:5173/crops', name: 'Crops' },
        { href: 'http://localhost:5173/livestock', name: 'Livestock' },
        { href: 'http://localhost:5173/fisheries', name: 'Fisheries' },
      ],
    },
    {
      label: 'Quick Links',
      items: [
        { href: 'http://localhost:5173/', name: 'Home' },
        { href: 'http://localhost:5173/posts', name: 'Posts' },
        { href: 'http://localhost:5173/about', name: 'About' },
        { href: 'http://localhost:5173/contact', name: 'Contact' },
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
        { href: 'http://localhost:5173/terms', name: 'Terms Of Service' },
        { href: 'http://localhost:5173/privacy', name: 'Privacy Policy' },
        { href: 'http://localhost:5173/cookies', name: 'Cookies Policy' },
        { href: 'http://localhost:5173/faqs', name: 'FAQs' },
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
