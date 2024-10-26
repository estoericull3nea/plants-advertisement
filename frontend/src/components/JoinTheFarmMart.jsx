import React from 'react'

export default function JoinTheFarmMart() {
  return React.createElement(
    'section',
    { className: 'bg-zinc-900 py-20' },
    React.createElement(
      'div',
      {
        className: 'w-full lg:w-9/12 mx-auto flex flex-col items-center gap-8',
      },

      React.createElement(
        'p',
        {
          className:
            'text-zinc-100 w-full lg:w-9/12 text-4xl md:text-6xl text-center',
        },
        'Join the FarmMart Community Today!'
      ),
      React.createElement(
        'p',
        { className: 'text-zinc-400 md:w-7/12 text-center' },
        'Connect with others who share your passion for agriculture. Sign up now and start exploring.'
      ),
      React.createElement(
        'div',
        { className: 'space-x-4 flex items-center' },
        React.createElement(
          'button',
          {
            type: 'button',
            className:
              'px-4 py-2 text-white bg-main rounded-full duration-150 ',
          },
          'Sign Up'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className:
              'px-4 py-2 text-black bg-orange-50 rounded-full duration-150 hover:bg-orange-100 active:bg-orange-200',
          },
          'Contact'
        )
      )
    )
  )
}

function IconArrowRightShort(props) {
  return React.createElement(
    'svg',
    {
      fill: 'currentColor',
      viewBox: '0 0 16 16',
      height: '1em',
      width: '1em',
      ...props,
    },
    React.createElement('path', {
      fillRule: 'evenodd',
      d: 'M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z',
    })
  )
}
