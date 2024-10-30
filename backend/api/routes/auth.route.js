// routes/userRoutes.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import { loginUser, registerUser } from '../controllers/auth.controller.js'
import { deleteAllUsers } from '../controllers/user.controller.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

router.post('/register', upload.single('idImage'), registerUser)
router.post('/login', loginUser)

export default router
