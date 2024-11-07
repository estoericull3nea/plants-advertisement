import express from 'express'
import {
  countChats,
  countProducts,
  countUsers,
  getAllUsers,
  getAverageProductPosts,
  getLatestChats,
  getTop5RecentProducts,
  getTop5RecentUsers,
  getUserRegistrationsForChart,
} from '../controllers/data.controller.js'

const router = express.Router()

router.get('/count-users', countUsers)

router.get('/count-products', countProducts)
router.get('/count-chats', countChats)
router.get('/top-5-recent-users', getTop5RecentUsers)
router.get('/top-5-recent-products', getTop5RecentProducts)
router.get('/latest-chats', getLatestChats)
router.get('/get-all-users', getAllUsers)

router.get('/registration-data', getUserRegistrationsForChart)
router.get('/average-product-posts', getAverageProductPosts)

export default router
