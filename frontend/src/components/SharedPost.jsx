import React from 'react'

const SharedPost = ({ share }) => {
  console.log(share)
  const { productId, userId } = share
  const { title, caption, category, price, images, productUrl } = productId // Assuming productUrl is available

  return (
    <div className='my-4 '>
      <a
        href={`/products/${productId._id}`} // Link to the product page (make sure to provide a valid URL)
        target='_blank' // Open the link in a new tab
        rel='noopener noreferrer' // For security (prevents malicious sites from accessing window.opener)
        className='block border p-4 rounded-lg shadow-md bg-white hover:bg-gray-100 transition'
      >
        {/* Display Product Image(s) */}
        <div className='flex flex-wrap space-x-4 mb-4'>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image} // Assuming 'image' is a URL
                alt={`Product Image ${index + 1}`}
                className='w-full sm:w-32 h-32 object-cover rounded-lg mb-2 sm:mb-0' // Make image responsive
              />
            ))
          ) : (
            <div>No images available</div>
          )}
        </div>

        <h3 className='text-xl font-semibold mt-2'>{category.toUpperCase()}</h3>

        {/* Display Product Title */}
        <h3 className='text-md font-semibold mt-2'>{title}</h3>

        {/* Display Product Caption */}
        <p className='text-sm mt-2 text-gray-700'>{caption}</p>

        {/* Display Product Price */}
        <div className='mt-2'>
          <span className='font-bold'>Price: </span>
          <span>{`₱${price.toFixed(2)}`}</span> {/* Format price as currency */}
        </div>

        {/* Display shared by user */}
        <div className='text-sm mt-2 text-gray-500'>
          Shared by:{' '}
          {userId ? `${userId.firstName} ${userId.lastName}` : 'Unknown User'}
        </div>
      </a>
    </div>
  )
}

export default SharedPost
