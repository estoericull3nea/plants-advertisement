import React from 'react'

const Footer = () => {
  const footerNavs = [
    {
      label: 'Resources',
      items: [
        { href: 'javascript:void(0)', name: 'Contact' },
        { href: 'javascript:void(0)', name: 'Support' },
        { href: 'javascript:void(0)', name: 'Documentation' },
        { href: 'javascript:void(0)', name: 'Pricing' },
      ],
    },
    {
      label: 'About',
      items: [
        { href: 'javascript:void(0)', name: 'Terms' },
        { href: 'javascript:void(0)', name: 'License' },
        { href: 'javascript:void(0)', name: 'Privacy' },
        { href: 'javascript:void(0)', name: 'About Us' },
      ],
    },
    {
      label: 'Explore',
      items: [
        { href: 'javascript:void(0)', name: 'Showcase' },
        { href: 'javascript:void(0)', name: 'Roadmap' },
        { href: 'javascript:void(0)', name: 'Languages' },
        { href: 'javascript:void(0)', name: 'Blog' },
      ],
    },
    {
      label: 'Company',
      items: [
        { href: 'javascript:void(0)', name: 'Partners' },
        { href: 'javascript:void(0)', name: 'Team' },
        { href: 'javascript:void(0)', name: 'Careers' },
      ],
    },
  ]

  return (
    <footer className='pt-10'>
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
            © 2022 Flash UI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
