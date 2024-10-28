// routes/userRoutes.js
import express from 'express'
import multer from 'multer'
import { registerUser } from '../controllers/auth.controller.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' }) // Set the upload directory

router.post('/register', upload.single('id-image'), registerUser)

export default router
