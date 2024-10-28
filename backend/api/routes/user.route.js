// routes/userRoutes.js
import express from 'express'
import {
  deleteAllUsers,
  getAllUsers,
  updateUserById,
} from '../controllers/user.controller.js'

const router = express.Router()

router.delete('/', deleteAllUsers)
router.get('/', getAllUsers)
router.put('/:userId', updateUserById)

export default router
