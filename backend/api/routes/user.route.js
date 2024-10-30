// routes/userRoutes.js
import express from 'express'
import {
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.controller.js'

const router = express.Router()

router.delete('/', deleteAllUsers)
router.get('/', getAllUsers)
router.put('/:userId', updateUserById)
router.get('/:userId', getUserById)
router.delete('/:userId', deleteUserById)

export default router
