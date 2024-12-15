// routes/shareRoutes.js
import express from 'express'
import {
  deleteShare,
  getAllShares,
  getSharesByUserId,
  trackShare,
} from '../controllers/share.controller.js'

const router = express.Router()

router.post('/track', trackShare)
router.get('/user/:userId', getSharesByUserId)
router.delete('/:postId', deleteShare)

router.get('/all', getAllShares)

export default router
