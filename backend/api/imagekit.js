// config/imageKitConfig.js

import ImageKit from 'imagekit'
import dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

// Initialize ImageKit SDK with the credentials
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

export default imageKit
