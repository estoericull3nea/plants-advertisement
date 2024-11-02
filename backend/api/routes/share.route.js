// routes/shareRoutes.js
import express from 'express'
import { trackShare } from '../controllers/share.controller.js'

const router = express.Router()

router.post('/track', trackShare)

export default router
