// routes/userRoutes.js
import express from 'express'
import { deleteAllUsers, getAllUsers } from '../controllers/user.controller.js'

const router = express.Router()

router.delete('/', deleteAllUsers)
router.get('/', getAllUsers)

export default router
