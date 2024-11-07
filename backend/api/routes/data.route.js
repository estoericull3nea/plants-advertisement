import express from 'express'
import {
  countChats,
  countProducts,
  countUsers,
} from '../controllers/data.controller.js'

const router = express.Router()

router.get('/count-users', countUsers)

router.get('/count-products', countProducts)
router.get('/count-chats', countChats)

export default router
