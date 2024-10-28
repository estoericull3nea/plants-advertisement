// routes/userRoutes.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import { registerUser } from '../controllers/auth.controller.js'
import { deleteAllUsers } from '../controllers/user.controller.js'

const router = express.Router()

// Set up storage to preserve original filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // Save the file with its original name
  },
})

const upload = multer({ storage })

router.post('/register', upload.single('idImage'), registerUser)

export default router
