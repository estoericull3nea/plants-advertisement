import express from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage })

import verifyToken from '../middlewares/verifyToken.js'
import { getMessages, sendMessage } from '../controllers/chat.controller.js'

router.post('/send', verifyToken, upload.array('images', 30), sendMessage)
router.get('/:userId/messages', verifyToken, getMessages)

export default router
