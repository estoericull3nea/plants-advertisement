import imagekit from '../imagekit.js'

// Function to upload an image to ImageKit
const uploadImage = async (fileBuffer, fileName) => {
  try {
    const uploadResponse = await imagekit.upload({
      file: fileBuffer.toString('base64'),
      fileName: fileName,
    })

    return uploadResponse.url
  } catch (error) {
    console.error('Error uploading to ImageKit:', error)
    throw new Error('Failed to upload image')
  }
}

export { uploadImage }
