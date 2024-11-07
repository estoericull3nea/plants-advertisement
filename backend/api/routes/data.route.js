import express from 'express'
import {
  countChats,
  countProducts,
  countUsers,
  getTop5RecentUsers,
} from '../controllers/data.controller.js'

const router = express.Router()

router.get('/count-users', countUsers)

router.get('/count-products', countProducts)
router.get('/count-chats', countChats)
router.get('/top-5-recent-users', getTop5RecentUsers)

export default router
